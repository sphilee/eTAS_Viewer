//=====================================================================================================
// MadgwickAHRS.c
//=====================================================================================================
//
// Implementation of Madgwick's IMU and AHRS algorithms.
// See: http://www.x-io.co.uk/node/8#open_source_ahrs_and_imu_algorithms
//
// Date         Author          Notes
// 29/09/2011   SOH Madgwick    Initial release
// 02/10/2011   SOH Madgwick    Optimised for reduced CPU load
// 19/02/2012   SOH Madgwick    Magnetometer measurement is normalised
//
//=====================================================================================================

'use strict';

/**
 * The Madgwick algorithm.  See: http://www.x-io.co.uk/open-source-imu-and-ahrs-algorithms/
 * @param {number} sampleInterval The sample interval in milliseconds.
 */
function Madgwick(sampleInterval, options) {

  //---------------------------------------------------------------------------------------------------
  // Definitions

  options = options || {};
  var sampleFreq = 1000 / sampleInterval; // sample frequency in Hz
  var beta = options.beta || 1.0; // 2 * proportional gain - lower numbers are smoother, but take longer to get to correct attitude.

  //---------------------------------------------------------------------------------------------------
  // Variable definitions
  var q0 = 1.0,
    q1 = 0.0,
    q2 = 0.0,
    q3 = 0.0; // quaternion of sensor frame relative to auxiliary frame
  var recipSampleFreq = 1.0 / sampleFreq;

  return {
    update: madgwickAHRSupdate,
    getQuaternion: function() {
      return {
        w: q0,
        x: q1,
        y: q2,
        z: q3
      };
    },
    conj: function() {
      return {
        w: q0,
        x: q1 * -1,
        y: q2 * -1,
        z: q3 * -1
      };
    },
    set: function(a) {
      q0 = a.w;
      q1 = a.x;
      q2 = a.y;
      q3 = a.z;
    },
    multiply: function(b) {
      var qax = q1,
        qay = q2,
        qaz = q3,
        qaw = q0,
        qbx = b.x,
        qby = b.y,
        qbz = b.z,
        qbw = b.w;


      return {
        x: qax * qbw + qaw * qbx + qay * qbz - qaz * qby,
        y: qay * qbw + qaw * qby + qaz * qbx - qax * qbz,
        z: qaz * qbw + qaw * qbz + qax * qby - qay * qbx,
        w: qaw * qbw - qax * qbx - qay * qby - qaz * qbz
      }
    }
  };


  //====================================================================================================
  // Functions

  //---------------------------------------------------------------------------------------------------
  // IMU algorithm update
  function madgwickAHRSupdateIMU(gx, gy, gz, ax, ay, az, cnt) {
    var recipNorm;
    var s0, s1, s2, s3;
    var qDot1, qDot2, qDot3, qDot4;
    var V_2q0, V_2q1, V_2q2, V_2q3, V_4q0, V_4q1, V_4q2, V_8q1, V_8q2, q0q0, q1q1, q2q2, q3q3;


    if (cnt < 20) //Fast posture estimation for 2 seconds
      beta = 1;
    else
      beta = options.beta;


    // Rate of change of quaternion from gyroscope
    qDot1 = 0.5 * (-q1 * gx - q2 * gy - q3 * gz);
    qDot2 = 0.5 * (q0 * gx + q2 * gz - q3 * gy);
    qDot3 = 0.5 * (q0 * gy - q1 * gz + q3 * gx);
    qDot4 = 0.5 * (q0 * gz + q1 * gy - q2 * gx);

    // Compute feedback only if accelerometer measurement valid (avoids NaN in accelerometer normalisation)
    if (!((ax === 0.0) && (ay === 0.0) && (az === 0.0))) {

      // Normalise accelerometer measurement
      recipNorm = Math.pow(ax * ax + ay * ay + az * az, -0.5);
      ax *= recipNorm;
      ay *= recipNorm;
      az *= recipNorm;

      // Auxiliary variables to avoid repeated arithmetic
      V_2q0 = 2.0 * q0;
      V_2q1 = 2.0 * q1;
      V_2q2 = 2.0 * q2;
      V_2q3 = 2.0 * q3;
      V_4q0 = 4.0 * q0;
      V_4q1 = 4.0 * q1;
      V_4q2 = 4.0 * q2;
      V_8q1 = 8.0 * q1;
      V_8q2 = 8.0 * q2;
      q0q0 = q0 * q0;
      q1q1 = q1 * q1;
      q2q2 = q2 * q2;
      q3q3 = q3 * q3;

      // Gradient decent algorithm corrective step
      s0 = V_4q0 * q2q2 + V_2q2 * ax + V_4q0 * q1q1 - V_2q1 * ay;
      s1 = V_4q1 * q3q3 - V_2q3 * ax + 4.0 * q0q0 * q1 - V_2q0 * ay - V_4q1 + V_8q1 * q1q1 + V_8q1 * q2q2 + V_4q1 * az;
      s2 = 4.0 * q0q0 * q2 + V_2q0 * ax + V_4q2 * q3q3 - V_2q3 * ay - V_4q2 + V_8q2 * q1q1 + V_8q2 * q2q2 + V_4q2 * az;
      s3 = 4.0 * q1q1 * q3 - V_2q1 * ax + 4.0 * q2q2 * q3 - V_2q2 * ay;
      recipNorm = Math.pow(s0 * s0 + s1 * s1 + s2 * s2 + s3 * s3, -0.5); // normalise step magnitude
      s0 *= recipNorm;
      s1 *= recipNorm;
      s2 *= recipNorm;
      s3 *= recipNorm;

      // Apply feedback step
      qDot1 -= beta * s0;
      qDot2 -= beta * s1;
      qDot3 -= beta * s2;
      qDot4 -= beta * s3;
    }

    // Integrate rate of change of quaternion to yield quaternion
    q0 += qDot1 * recipSampleFreq;
    q1 += qDot2 * recipSampleFreq;
    q2 += qDot3 * recipSampleFreq;
    q3 += qDot4 * recipSampleFreq;

    // Normalise quaternion
    recipNorm = Math.pow(q0 * q0 + q1 * q1 + q2 * q2 + q3 * q3, -0.5);
    q0 *= recipNorm;
    q1 *= recipNorm;
    q2 *= recipNorm;
    q3 *= recipNorm;
  }

  //---------------------------------------------------------------------------------------------------
  // AHRS algorithm update

  function madgwickAHRSupdate(gx, gy, gz, ax, ay, az, cnt, mx, my, mz, deltaTimeSec) {
    recipSampleFreq = deltaTimeSec || recipSampleFreq;
    var recipNorm;
    var s0, s1, s2, s3;
    var qDot1, qDot2, qDot3, qDot4;
    var hx, hy;
    var V_2q0mx, V_2q0my, V_2q0mz, V_2q1mx, V_2bx, V_2bz, V_4bx, V_4bz, V_2q0, V_2q1, V_2q2, V_2q3, V_2q0q2, V_2q2q3;
    var q0q0, q0q1, q0q2, q0q3, q1q1, q1q2, q1q3, q2q2, q2q3, q3q3;

    // Use IMU algorithm if magnetometer measurement invalid (avoids NaN in magnetometer normalisation)
    if (mx === undefined || my === undefined || mz === undefined || (mx === 0 && my === 0 && mz === 0)) {
      madgwickAHRSupdateIMU(gx, gy, gz, ax, ay, az, cnt);
      return;
    }

    // Rate of change of quaternion from gyroscope
    qDot1 = 0.5 * (-q1 * gx - q2 * gy - q3 * gz);
    qDot2 = 0.5 * (q0 * gx + q2 * gz - q3 * gy);
    qDot3 = 0.5 * (q0 * gy - q1 * gz + q3 * gx);
    qDot4 = 0.5 * (q0 * gz + q1 * gy - q2 * gx);

    // Compute feedback only if accelerometer measurement valid (avoids NaN in accelerometer normalisation)
    if (!((ax === 0.0) && (ay === 0.0) && (az === 0.0))) {

      // Normalise accelerometer measurement
      recipNorm = Math.pow(ax * ax + ay * ay + az * az, -0.5);
      ax *= recipNorm;
      ay *= recipNorm;
      az *= recipNorm;

      // Normalise magnetometer measurement
      recipNorm = Math.pow(mx * mx + my * my + mz * mz, -0.5);
      mx *= recipNorm;
      my *= recipNorm;
      mz *= recipNorm;

      // Auxiliary variables to avoid repeated arithmetic
      V_2q0mx = 2.0 * q0 * mx;
      V_2q0my = 2.0 * q0 * my;
      V_2q0mz = 2.0 * q0 * mz;
      V_2q1mx = 2.0 * q1 * mx;
      V_2q0 = 2.0 * q0;
      V_2q1 = 2.0 * q1;
      V_2q2 = 2.0 * q2;
      V_2q3 = 2.0 * q3;
      V_2q0q2 = 2.0 * q0 * q2;
      V_2q2q3 = 2.0 * q2 * q3;
      q0q0 = q0 * q0;
      q0q1 = q0 * q1;
      q0q2 = q0 * q2;
      q0q3 = q0 * q3;
      q1q1 = q1 * q1;
      q1q2 = q1 * q2;
      q1q3 = q1 * q3;
      q2q2 = q2 * q2;
      q2q3 = q2 * q3;
      q3q3 = q3 * q3;

      // Reference direction of Earth's magnetic field
      hx = mx * q0q0 - V_2q0my * q3 + V_2q0mz * q2 + mx * q1q1 + V_2q1 * my * q2 + V_2q1 * mz * q3 - mx * q2q2 - mx * q3q3;
      hy = V_2q0mx * q3 + my * q0q0 - V_2q0mz * q1 + V_2q1mx * q2 - my * q1q1 + my * q2q2 + V_2q2 * mz * q3 - my * q3q3;
      V_2bx = Math.sqrt(hx * hx + hy * hy);
      V_2bz = -V_2q0mx * q2 + V_2q0my * q1 + mz * q0q0 + V_2q1mx * q3 - mz * q1q1 + V_2q2 * my * q3 - mz * q2q2 + mz * q3q3;
      V_4bx = 2.0 * V_2bx;
      V_4bz = 2.0 * V_2bz;

      // Gradient decent algorithm corrective step
      s0 = -V_2q2 * (2.0 * q1q3 - V_2q0q2 - ax) + V_2q1 * (2.0 * q0q1 + V_2q2q3 - ay) - V_2bz * q2 * (V_2bx * (0.5 - q2q2 - q3q3) + V_2bz * (q1q3 - q0q2) - mx) + (-V_2bx * q3 + V_2bz * q1) * (V_2bx * (q1q2 - q0q3) + V_2bz * (q0q1 + q2q3) - my) + V_2bx * q2 * (V_2bx * (q0q2 + q1q3) + V_2bz * (0.5 - q1q1 - q2q2) - mz);
      s1 = V_2q3 * (2.0 * q1q3 - V_2q0q2 - ax) + V_2q0 * (2.0 * q0q1 + V_2q2q3 - ay) - 4.0 * q1 * (1 - 2.0 * q1q1 - 2.0 * q2q2 - az) + V_2bz * q3 * (V_2bx * (0.5 - q2q2 - q3q3) + V_2bz * (q1q3 - q0q2) - mx) + (V_2bx * q2 + V_2bz * q0) * (V_2bx * (q1q2 - q0q3) + V_2bz * (q0q1 + q2q3) - my) + (V_2bx * q3 - V_4bz * q1) * (V_2bx * (q0q2 + q1q3) + V_2bz * (0.5 - q1q1 - q2q2) - mz);
      s2 = -V_2q0 * (2.0 * q1q3 - V_2q0q2 - ax) + V_2q3 * (2.0 * q0q1 + V_2q2q3 - ay) - 4.0 * q2 * (1 - 2.0 * q1q1 - 2.0 * q2q2 - az) + (-V_4bx * q2 - V_2bz * q0) * (V_2bx * (0.5 - q2q2 - q3q3) + V_2bz * (q1q3 - q0q2) - mx) + (V_2bx * q1 + V_2bz * q3) * (V_2bx * (q1q2 - q0q3) + V_2bz * (q0q1 + q2q3) - my) + (V_2bx * q0 - V_4bz * q2) * (V_2bx * (q0q2 + q1q3) + V_2bz * (0.5 - q1q1 - q2q2) - mz);
      s3 = V_2q1 * (2.0 * q1q3 - V_2q0q2 - ax) + V_2q2 * (2.0 * q0q1 + V_2q2q3 - ay) + (-V_4bx * q3 + V_2bz * q1) * (V_2bx * (0.5 - q2q2 - q3q3) + V_2bz * (q1q3 - q0q2) - mx) + (-V_2bx * q0 + V_2bz * q2) * (V_2bx * (q1q2 - q0q3) + V_2bz * (q0q1 + q2q3) - my) + V_2bx * q1 * (V_2bx * (q0q2 + q1q3) + V_2bz * (0.5 - q1q1 - q2q2) - mz);
      recipNorm = Math.pow(s0 * s0 + s1 * s1 + s2 * s2 + s3 * s3, -0.5); // normalise step magnitude
      s0 *= recipNorm;
      s1 *= recipNorm;
      s2 *= recipNorm;
      s3 *= recipNorm;

      // Apply feedback step
      qDot1 -= beta * s0;
      qDot2 -= beta * s1;
      qDot3 -= beta * s2;
      qDot4 -= beta * s3;
    }

    // Integrate rate of change of quaternion to yield quaternion
    q0 += qDot1 * recipSampleFreq;
    q1 += qDot2 * recipSampleFreq;
    q2 += qDot3 * recipSampleFreq;
    q3 += qDot4 * recipSampleFreq;

    // Normalise quaternion
    recipNorm = Math.pow(q0 * q0 + q1 * q1 + q2 * q2 + q3 * q3, -0.5);
    q0 *= recipNorm;
    q1 *= recipNorm;
    q2 *= recipNorm;
    q3 *= recipNorm;
  }

  //====================================================================================================
  // END OF CODE
  //====================================================================================================

};

/*********************************************************************
 *                                                                   *
 *   Copyright 2016 Simon M. Werner                                  *
 *                                                                   *
 *   Licensed to the Apache Software Foundation (ASF) under one      *
 *   or more contributor license agreements.  See the NOTICE file    *
 *   distributed with this work for additional information           *
 *   regarding copyright ownership.  The ASF licenses this file      *
 *   to you under the Apache License, Version 2.0 (the               *
 *   "License"); you may not use this file except in compliance      *
 *   with the License.  You may obtain a copy of the License at      *
 *                                                                   *
 *      http://www.apache.org/licenses/LICENSE-2.0                   *
 *                                                                   *
 *   Unless required by applicable law or agreed to in writing,      *
 *   software distributed under the License is distributed on an     *
 *   "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY          *
 *   KIND, either express or implied.  See the License for the       *
 *   specific language governing permissions and limitations         *
 *   under the License.                                              *
 *                                                                   *
 *********************************************************************/

'use strict';

var rad2deg = 180 / Math.PI;

function AHRS(options) {
  options = options || {};
  var sampleInterval = options.sampleInterval || 20;
  var algorithmName = options.algorithm || 'Madgwick';

  var algorithmFn;
  if (algorithmName === 'Mahony') {
    algorithmFn = new Mahony(sampleInterval, options);
  } else if (algorithmName === 'Madgwick') {
    algorithmFn = new Madgwick(sampleInterval, options);
  } else {
    throw new Error('AHRS(): Algorithm not valid: ', algorithmName);
  }

  // Copy all properties accross
  for (var prop in algorithmFn) {
    if (algorithmFn.hasOwnProperty(prop)) {
      this[prop] = algorithmFn[prop];
    }
  }

}

/**
 * Convert the quaternion to a vector with angle.  Reverse of the code
 * in the following link: http://www.euclideanspace.com/maths/geometry/rotations/conversions/angleToQuaternion/index.htm
 * @return {object} Normalised vector - {x, y, z, angle}
 */
AHRS.prototype.toVector = function() {
  var q = this.getQuaternion();
  var angle = 2 * Math.acos(q.w);
  var sinAngle = Math.sin(angle / 2);
  return {
    angle: angle,
    x: q.x / sinAngle,
    y: q.y / sinAngle,
    z: q.z / sinAngle
  };
};

/**
 * Return an object with the Euler angles {yaw, pitch, roll}, in radians.
 *
 * Where:
 *   - yaw is from magnetic north, going west (about z-axis).
 *   - pitch is from vertical, going forward (about y-axis).
 *   - roll is from vertical, going right (about x-axis).
 *
 * Thanks to:
 *   https://github.com/PenguPilot/PenguPilot/blob/master/autopilot/service/util/math/quat.c#L103
 * @return {object} {yaw, pitch, roll} in radians
 */
AHRS.prototype.getEulerAngles = function() {
  var q = this.getQuaternion();
  var ww = q.w * q.w,
    xx = q.x * q.x,
    yy = q.y * q.y,
    zz = q.z * q.z;
  return {
    yaw: Math.atan2(2 * (q.x * q.y + q.z * q.w), xx - yy - zz + ww),
    pitch: -Math.asin(2 * (q.x * q.z - q.y * q.w)),
    roll: Math.atan2(2 * (q.y * q.z + q.x * q.w), -xx - yy + zz + ww)
  };
};

/**
 * Return an object with the Euler angles {yaw, pitch, roll}, in radians.
 *
 * Where:
 *   - yaw is from magnetic north, going west (about z-axis).
 *   - pitch is from vertical, going forward (about y-axis).
 *   - roll is from vertical, going right (about x-axis).
 *
 * Thanks to:
 *   https://github.com/PenguPilot/PenguPilot/blob/master/autopilot/service/util/math/quat.c#L103
 * @return {object} {yaw, pitch, roll} in radians
 */
AHRS.prototype.getEulerAnglesDegrees = function() {
  var getEulerAnglesRad = this.getEulerAngles();
  return {
    yaw: getEulerAnglesRad.yaw * rad2deg,
    pitch: getEulerAnglesRad.pitch * rad2deg,
    roll: getEulerAnglesRad.roll * rad2deg
  };
};
