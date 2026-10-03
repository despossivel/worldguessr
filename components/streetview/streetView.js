import React, { useEffect, useRef } from "react";

const StreetView = ({
  nm = false,
  npz = false,
  showRoadLabels = true,
  lat,
  long,
  panoId,
  heading,
  pitch,
  showAnswer = false,
  hidden = false,
  // PURE-IDLE state (home menu, staging lobby, join screen, queue, 2v2 end):
  // the frame gets display:none, which is the ONLY thing that makes Chrome
  // stop servicing a cross-origin iframe's rAF — opacity:0 keeps the Google
  // embed rendering at full rate. Never set for loading/conceal windows
  // (those fade back in; display kills the transition) — home.js pairs every
  // idle exit with a 2-frame `hidden` grace for exactly that reason.
  idle = false,
  slowEnter = false,
  refreshKey = 0,
  onLoad,
  onError,
}) => {
  const iframeRef = useRef(null);
  const previousKey = useRef(null);

  const buildSrc = () => {
    const view = panoId
      ? `pano=${encodeURIComponent(panoId)}`
      : `location=${lat},${long}`;
    const headingParam = (heading !== null && heading !== undefined) ? `&heading=${heading}` : '';
    const pitchParam = (false && pitch !== null && pitch !== undefined) ? `&pitch=${pitch}` : '';
    return `https://www.google.com/maps/embed/v1/streetview?${view}&key=AIzaSyA_t5gb2Mn37dZjhsaJ4F-OPp1PWDxqZyI&fov=100&language=en${headingParam}${pitchParam}`;
  };

  useEffect(() => {
    if (!iframeRef.current || (!panoId && (lat == null || long == null))) return;
    const key = `${panoId || `${lat},${long}`}:${refreshKey}`;
    if (previousKey.current === key && iframeRef.current.getAttribute('src')) return;
    iframeRef.current.src = buildSrc();
    previousKey.current = key;
  }, [lat, long, panoId, heading, pitch, refreshKey]);

  if (!panoId && (lat == null || long == null)) return null;

  return (
    <iframe
      ref={iframeRef}
      className={`${(npz && nm && !showAnswer) ? 'nmpz' : ''} ${hidden ? "hidden" : ""} ${idle ? "sv-idle" : ""} ${slowEnter ? "streetview--duel-enter" : ""} streetview`}
      referrerPolicy="no-referrer-when-downgrade"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
      onLoad={() => onLoad?.()}
      onError={() => onError?.()}
      loading="eager"
      style={{
        width: "100vw",
        height: "calc(100vh + 300px)",
        zIndex: 100,
        transform: "translateY(-285px)",
        border: "none",
        backgroundColor: "#1a1a2e", // Dark background to prevent white flash during loading
      }}
      id="streetview"
    />
  );
};

export default StreetView;
