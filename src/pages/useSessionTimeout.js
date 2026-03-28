import { useEffect } from 'react';

const TIMEOUT_DURATION = 20 * 60 * 1000; // 20 minutes

const useSessionTimeout = (redirectPath = '/login') => {
  useEffect(() => {
    let timer;

    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        localStorage.removeItem('employeeData');
        alert('You have been logged out due to inactivity.');
        window.location.href = redirectPath;
      }, TIMEOUT_DURATION);
    };

    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    events.forEach(event => window.addEventListener(event, resetTimer));

    resetTimer();

    return () => {
      clearTimeout(timer);
      events.forEach(event => window.removeEventListener(event, resetTimer));
    };
  }, [redirectPath]);
};

export default useSessionTimeout;