import React, { useState, useEffect, useRef } from 'react';
import QrScanner from 'qr-scanner';
import './QRScannerPage.css';

const QRScannerPage = () => {
  const [scannedData, setScannedData] = useState(null);
  const [audioData, setAudioData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentAudioIndex, setCurrentAudioIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioDuration, setAudioDuration] = useState(0);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const [showCameraPopup, setShowCameraPopup] = useState(false);

  const videoRef = useRef(null);
  const qrScannerRef = useRef(null);
  const audioRef = useRef(null);

  // Khởi tạo QR Scanner
  useEffect(() => {
    if (videoRef.current && showCameraPopup) {
      qrScannerRef.current = new QrScanner(
        videoRef.current,
        (result) => {
          console.log('QR Code detected:', result.data);
          setScannedData(result.data);
          fetchAudioData(result.data);
          qrScannerRef.current.stop();
          setShowCameraPopup(false);
        },
        {
          highlightScanRegion: true,
          highlightCodeOutline: true,
        }
      );
    }

    return () => {
      if (qrScannerRef.current) {
        qrScannerRef.current.destroy();
      }
    };
  }, [showCameraPopup]);

  // Fetch audio data từ API
  const fetchAudioData = async (qrToken) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`https://essgenius-be.onrender.com/api/books/qr/${qrToken}`);
      const data = await response.json();

      if (data.success) {
        setAudioData(data.data);
        setCurrentAudioIndex(0);
      } else {
        setError(data.message || 'Cannot load audio data');
      }
    } catch (err) {
      setError('Connection error to server');
      console.error('Error fetching audio data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Bắt đầu quét QR
  const startScanning = async () => {
    try {
      setShowCameraPopup(true);
      setScannedData(null);
      setAudioData(null);
      setError(null);

      // Wait for popup to show and video element to be ready
      setTimeout(async () => {
        if (qrScannerRef.current) {
          await qrScannerRef.current.start();
        }
      }, 100);
    } catch (err) {
      setError('Cannot access camera. Please allow camera permission.');
      setShowCameraPopup(false);
    }
  };

  // Đóng popup camera
  const closeCameraPopup = () => {
    if (qrScannerRef.current) {
      qrScannerRef.current.stop();
    }
    setShowCameraPopup(false);
  };

  // ... (Audio functions omitted for brevity if unchanged) ...
  // Phát audio
  const playAudio = (audioUrl, index = currentAudioIndex) => {
    if (!audioUrl) return;

    setCurrentAudioIndex(index);
    if (audioRef.current) {
      audioRef.current.src = audioUrl;
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  // Dừng audio
  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  // Chuyển audio tiếp theo
  const nextAudio = () => {
    if (audioData && currentAudioIndex < audioData.audioItems.length - 1) {
      const nextIndex = currentAudioIndex + 1;
      setCurrentAudioIndex(nextIndex);
      if (isPlaying) {
        playAudio(audioData.audioItems[nextIndex].audioUrl, nextIndex);
      }
    }
  };

  // Chuyển audio trước
  const prevAudio = () => {
    if (currentAudioIndex > 0) {
      const prevIndex = currentAudioIndex - 1;
      setCurrentAudioIndex(prevIndex);
      if (isPlaying) {
        playAudio(audioData.audioItems[prevIndex].audioUrl, prevIndex);
      }
    }
  };

  // Xử lý thay đổi thời gian audio
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setAudioCurrentTime(audioRef.current.currentTime);
      setAudioDuration(audioRef.current.duration);
    }
  };

  // Handle progress bar seeking
  const handleSeek = (e) => {
    if (audioRef.current && audioDuration) {
      const progressBar = e.currentTarget;
      const rect = progressBar.getBoundingClientRect();
      // Support both mouse and touch events
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const x = clientX - rect.left;
      const percentage = Math.max(0, Math.min(1, x / rect.width));
      const newTime = percentage * audioDuration;
      audioRef.current.currentTime = newTime;
      setAudioCurrentTime(newTime);
    }
  };

  // Xử lý khi audio kết thúc
  const handleAudioEnded = () => {
    if (!audioData) {
      setIsPlaying(false);
      return;
    }

    if (currentAudioIndex < audioData.audioItems.length - 1) {
      const nextIndex = currentAudioIndex + 1;
      playAudio(audioData.audioItems[nextIndex].audioUrl, nextIndex);
      return;
    }

    setIsPlaying(false);
  };

  // Format thời gian
  const formatTime = (seconds) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="qr-scanner-page">
      <div className="container">
        {/* Main Content Layout */}
        <div className="main-content">
          {/* Left Section - QR Form */}
          <div className="qr-form-section">
            <div className="form-card">
              <h2 className="form-title">Scan Book QR Code</h2>

              <div className="form-content">
                <button
                  onClick={startScanning}
                  className="scan-btn"
                  disabled={loading}
                >
                  {loading ? 'Scanning...' : 'START SCANNING'}
                </button>

                <div className="note-section">
                  <h4>Note:</h4>
                  <p>• Ensure camera permission is granted</p>
                  <p>• Point camera at the QR code on the book</p>
                  <p>• Contact support: 0918575408</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Promotional Banner */}
          <div className="promo-section">
            <div className="instruction-banner">
              <p>Please scan the QR code on the book to listen to the audio</p>
            </div>

            <div className="promo-banner">
              <div className="promo-content">
                <div className="cta-buttons">
                  <button className="book-now-btn">
                    <span className="phone-icon">📞</span>
                    Don't have the book?
                    <a href="/books">Buy Now</a>
                    <span className="hot-badge">HOT</span>
                  </button>

                  <button className="phone-btn">
                    0918575408
                  </button>
                </div>

                <div className="character">
                  <div className="cartoon-character">📚</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Camera Popup */}
        {showCameraPopup && (
          <div className="camera-popup-overlay">
            <div className="camera-popup">
              <div className="popup-header">
                <h3>Scan QR Code</h3>
                <button onClick={closeCameraPopup} className="close-btn">✕</button>
              </div>

              <div className="camera-container">
                <video ref={videoRef} className="camera-video"></video>
                <div className="scanner-overlay">
  
                  <p className="scanner-instruction">Point camera at the QR code on the book</p>
                </div>
              </div>

              <div className="popup-controls">
                <button onClick={closeCameraPopup} className="stop-btn">
                  Stop Scanning
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="loading-overlay">
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Loading audio data...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="error-overlay">
            <div className="error-container">
              <p className="error-message">{error}</p>
              <button onClick={startScanning} className="retry-btn">
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Audio Player Section */}
        {audioData && (
          <div className="audio-section">
            <div className="book-info">
              <h2>{audioData.book.title}</h2>
              <p className="book-authors">Author: {audioData.book.authors.join(', ')}</p>
              <p className="book-description">{audioData.book.description}</p>
              <p className="audio-count">Total audio: {audioData.totalAudioCount}</p>
            </div>

            <div className="audio-player">
              <div className="current-audio-info">
                <h3>Current audio: {audioData.audioItems[currentAudioIndex]?.term}</h3>
                <p>Play count: {audioData.audioItems[currentAudioIndex]?.playCount}</p>
              </div>

              <div className="audio-controls">
                <button
                  onClick={prevAudio}
                  className="btn btn-control"
                  disabled={currentAudioIndex === 0}
                >
                  ⏮️
                </button>

                <button
                  onClick={
                    isPlaying
                      ? pauseAudio
                      : () => playAudio(audioData.audioItems[currentAudioIndex]?.audioUrl, currentAudioIndex)
                  }
                  className="btn btn-play"
                >
                  {isPlaying ? '⏸️' : '▶️'}
                </button>

                <button
                  onClick={nextAudio}
                  className="btn btn-control"
                  disabled={currentAudioIndex === audioData.audioItems.length - 1}
                >
                  ⏭️
                </button>
              </div>

              <div className="audio-progress">
                <span className="time">{formatTime(audioCurrentTime)}</span>
                <div
                  className="progress-bar"
                  onClick={handleSeek}
                  onTouchEnd={handleSeek}
                >
                  <div
                    className="progress-fill"
                    style={{
                      width: audioDuration ? `${(audioCurrentTime / audioDuration) * 100}%` : '0%'
                    }}
                  ></div>
                </div>
                <span className="time">{formatTime(audioDuration)}</span>
              </div>

              <audio
                ref={audioRef}
                onTimeUpdate={handleTimeUpdate}
                onEnded={handleAudioEnded}
                onLoadedMetadata={handleTimeUpdate}
              />
            </div>

            <div className="audio-list">
              <h3>Audio List</h3>
              <div className="audio-items">
                {audioData.audioItems.map((audio, index) => (
                  <div
                    key={audio._id}
                    className={`audio-item ${index === currentAudioIndex ? 'active' : ''}`}
                    onClick={() => {
                      setCurrentAudioIndex(index);
                      if (isPlaying) {
                        playAudio(audio.audioUrl, index);
                      }
                    }}
                  >
                    <div className="audio-term">{audio.term}</div>
                    <div className="audio-play-count">Plays: {audio.playCount} times</div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        playAudio(audio.audioUrl, index);
                      }}
                      className="btn btn-small"
                    >
                      ▶️
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QRScannerPage;