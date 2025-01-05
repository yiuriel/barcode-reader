import { BrowserMultiFormatReader, NotFoundException } from "@zxing/library";
import { useEffect, useState } from "react";
import "./App.css";

export function App() {
  const [videoRef, setVideoRef] = useState<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!videoRef) {
      return;
    }

    const codeReader = new BrowserMultiFormatReader();

    codeReader
      .listVideoInputDevices()
      .then((videoInputDevices) => {
        // const sourceSelect = document.getElementById("sourceSelect");
        console.log(videoInputDevices);

        const selectedDeviceId = videoInputDevices[0].deviceId;

        codeReader.decodeFromVideoDevice(
          selectedDeviceId,
          "video",
          (result, err) => {
            if (result) {
              const resultSpan = document.getElementById("result");
              if (resultSpan) {
                resultSpan.innerHTML = JSON.stringify(
                  result.getResultMetadata()
                );
              }
              console.log(result);
            }
            if (err && !(err instanceof NotFoundException)) {
              console.error(err);
            }
          }
        );
        console.log(
          `Started continous decode from camera with id ${selectedDeviceId}`
        );
      })
      .catch((err) => {
        console.error(err);
      });

    return () => {
      codeReader.reset();
    };
  }, [videoRef]);

  return (
    <div>
      Scan the QR code:
      <video
        id="video"
        width="300"
        height="200"
        style={{ border: "1px solid gray" }}
        ref={setVideoRef}
      ></video>
      <span id="result"></span>
    </div>
  );
}
