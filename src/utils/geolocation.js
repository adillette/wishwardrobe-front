/**
 * 브라우저 Geolocation API 래퍼
 * 사용자의 현재 위치(위도, 경도)를 가져옵니다.
 */

/**
 * 현재 위치 가져오기
 * @returns {Promise<{latitude: number, longitude: number}>}
 */
export const getCurrentPosition = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('브라우저가 위치 정보를 지원하지 않습니다'));
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
      },
      (error) => {
        let errorMessage = '위치 정보를 가져올 수 없습니다';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = '위치 권한이 거부되었습니다';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = '위치 정보를 사용할 수 없습니다';
            break;
          case error.TIMEOUT:
            errorMessage = '위치 정보 요청 시간이 초과되었습니다';
            break;
        }
        
        reject(new Error(errorMessage));
      },
      {
        enableHighAccuracy: true,  // 높은 정확도 요청
        timeout: 5000,             // 5초 제한
        maximumAge: 0              // 캐시 사용 안함
      }
    );
  });
};

/**
 * 위치 권한 확인
 * @returns {Promise<string>} 'granted', 'denied', 'prompt'
 */
export const checkLocationPermission = async () => {
  if (!navigator.permissions) {
    return 'unsupported';
  }
  
  try {
    const result = await navigator.permissions.query({ name: 'geolocation' });
    return result.state;
  } catch (error) {
    console.error('위치 권한 확인 실패:', error);
    return 'error';
  }
};

export default {
  getCurrentPosition,
  checkLocationPermission
};
