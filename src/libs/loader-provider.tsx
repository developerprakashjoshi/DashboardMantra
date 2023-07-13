"use client";
import React, { useEffect } from "react";
import nProgress from "nprogress";


let timer:any;
let state:any;
let activeRequests = 0;
const delay = 250;

function load() {
    nProgress.configure({ showSpinner: true });
  if (state === "loading") {
    return;
  }
  state = "loading";
  timer = setTimeout(function () {
    nProgress.start();
  }, delay); // only show progress bar if it takes longer than the delay
}

function stop() {
  state = "stop";
  clearTimeout(timer);
  nProgress.done();
}
if (typeof window !== "undefined") {
    load()
}
export default function LoaderProviders() {
         
useEffect(() => {
    if (document.readyState === "complete") {
        stop();
    } else {
      const handleDocumentLoad = () => {
        stop();
      };
      document.addEventListener("DOMContentLoaded", handleDocumentLoad);
      return () => {
         stop();
        document.removeEventListener("DOMContentLoaded", handleDocumentLoad);
      };
    }
  }, []);

  return <></>;
}
