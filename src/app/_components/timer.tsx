'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { Button } from '~/components/ui/button';
import { cn } from '~/lib/utils';

const initialTimes = {
  Focus: 1500,
  'Short Break': 300,
  'Long Break': 900,
};

export function Timer() {
  const [secondsLeft, setSecondsLeft] = useState(initialTimes.Focus);
  const [isPaused, setIsPaused] = useState(true);
  const [isStopped, setIsStopped] = useState(true);
  const [mode, setMode] = useState<keyof typeof initialTimes>('Focus');
  const audioRef = useRef(new Audio('/alarm-ring.mp3'));

  const formatTime = useCallback((seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
      .toString()
      .padStart(2, '0')}`;
  }, []);

  const handleStartPause = useCallback(() => {
    setIsStopped(false);
    setIsPaused(!isPaused);
  }, [isPaused]);

  const handleStop = useCallback(() => {
    setIsPaused(true);
    setIsStopped(true);
    setSecondsLeft(initialTimes[mode]);
  }, [mode]);

  const changeMode = useCallback(
    (newMode: keyof typeof initialTimes) => {
      if (newMode === mode && !isStopped) return;
      setSecondsLeft(initialTimes[newMode]);
      setMode(newMode);
      setIsPaused(true);
      setIsStopped(true);
    },
    [mode, isStopped]
  );

  useEffect(() => {
    let interval = undefined;
    if (!isPaused && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prevSeconds) => prevSeconds - 1);
      }, 1000);
    } else if (secondsLeft === 0) {
      clearInterval(interval);
      setIsPaused(true);
      setIsStopped(true);
      audioRef.current.play();
      changeMode(mode === 'Focus' ? 'Short Break' : 'Focus');
    }
    return () => clearInterval(interval);
  }, [isPaused, secondsLeft, mode, changeMode]);

  const renderButton = (label: keyof typeof initialTimes) => (
    <Button
      variant="ghost"
      className={cn(
        'text-xl',
        !isPaused && 'hover:bg-black hover:text-white pointer-events-none',
        isStopped && mode === label && 'bg-white text-black',
        !isStopped && mode !== label && 'hidden'
      )}
      onClick={() => changeMode(label)}
    >
      {label}
    </Button>
  );

  return (
    <>
      <div className="flex gap-2 flex-wrap justify-center">
        {renderButton('Focus')}
        {renderButton('Short Break')}
        {renderButton('Long Break')}
      </div>
      <div className="text-8xl font-bold">{formatTime(secondsLeft)}</div>
      <div className="flex gap-4">
        <Button
          size="lg"
          variant="outline"
          className="text-black text-lg font-bold"
          onClick={handleStartPause}
        >
          {isPaused ? 'Start' : 'Pause'}
        </Button>
        {!isStopped && (
          <Button
            size="lg"
            variant="outline"
            className={cn(
              'text-black text-lg font-bold',
              'hover:bg-red-500 hover:text-white hover:border-red-500 transition-colors'
            )}
            onClick={handleStop}
          >
            Give Up
          </Button>
        )}
      </div>
    </>
  );
}
