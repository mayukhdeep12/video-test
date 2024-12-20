import React, { useState, useRef, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

import { hightlightsSlides } from "../constants";
import { replayImg, pauseImg, playImg } from "../utils/index.js";

gsap.registerPlugin(ScrollTrigger);

const VideoCarousel = () => {
	const videoRef = useRef([]);
	const videoSpanRef = useRef([]);
	const videoDivRef = useRef([]);

	console.log("videoref--->", videoRef);

	const [video, setVideo] = useState({
		videoId: 0,
		playStart: false,
		isPlaying: false,
		isEnd: false,
		isLastVideo: false,
	});

	const { videoId, playStart, isPlaying, isEnd, isLastVideo } = video;
	const [loadedData, setLoadedData] = useState([]);

	//HANDLE LOADED META DATA
	const handleLoadedMetadata = (i, e) => {
		setLoadedData((pre) => [...pre, e]);
	};

	//Play the video
	useEffect(() => {
		if (loadedData.length > 3) {
			if (!isPlaying) {
				videoRef.current[videoId].pause();
			} else {
				playStart && videoRef.current[videoId].play();
			}
		}
	}, [loadedData, isPlaying, playStart, videoId]);

	//PROGRESS BAR
	useEffect(() => {
		let currentProgress = 0;

		let span = videoSpanRef.current;

		if (span[videoId]) {
			let anim = gsap.to(span[videoId], {
				onUpdate: () => {
					let progress = Math.ceil(anim.progress() * 100);

					if (progress !== currentProgress) {
						currentProgress = progress;

						// Give width to video Div Ref
						gsap.to(videoDivRef.current[videoId], {
							width:
								window.innerWidth < 760
									? "10vw"
									: window.innerWidth < 1200
									? "10vw"
									: "4vw",
						});

						// Give width to Video Span Ref
						gsap.to(span[videoId], {
							width: `${currentProgress}%`,
							backgroundColor: "white",
						});
					}
				},
				onComplete: () => {
					if (isPlaying) {
						gsap.to(videoDivRef.current[videoId], {
							width: "12px",
						});
						gsap.to(span[videoId], {
							backgroundColor: "#afafaf",
						});
					}
				},
			});

			if (videoId === 0) {
				anim.restart();
			}

			const animUpdate = () => {
				anim.progress(
					videoRef.current[videoId].currentTime /
						hightlightsSlides[videoId].videoDuration
				);
			};

			if (isPlaying) {
				gsap.ticker.add(animUpdate);
			} else {
				gsap.ticker.remove(animUpdate);
			}
		}
	}, [playStart, videoId, isPlaying]);

	//ANIMATION AND EFFECTS
	useGSAP(() => {
		//Animation for sliding video
		gsap.to("#slider", {
			transform: `translateX(${-100 * videoId}%)`,
			duration: 2,
			ease: "power2.inOut",
		});

		//Animation for video
		gsap.to("#video", {
			scrollTrigger: {
				trigger: "#video",
				toggleActions: "restart none none none",
			},
			// when video is triggered onComplete is called and then, change the "playStart" and "isPlaying" property to 'true
			onComplete: () => {
				setVideo((pre) => ({
					...pre,
					playStart: true,
					isPlaying: true,
				}));
			},
		});
	}, [videoId, isEnd]);

	// USER INTRACTION FOR "PLAY", "PAUSE", "RESET" VIDEO
	const handleProcess = (type, i) => {
		switch (type) {
			case "video-reset":
				setVideo((pre) => ({ ...pre, videoId: 0, isLastVideo: false }));
				break;

			case "play":
				setVideo((pre) => ({ ...pre, isPlaying: !pre.isPlaying }));
				break;

			case "pause":
				setVideo((pre) => ({ ...pre, isPlaying: !pre.isPlaying }));
				break;

			case "video-end":
				setVideo((pre) => ({ ...pre, isEnd: true, videoId: i + 1 }));
				break;

			case "video-last":
				setVideo((pre) => ({ ...pre, isLastVideo: true }));
				break;

			default:
				return video;
		}
	};

	return (
		<>
			<div className=" mt-12 flex items-center text-white  ">
				{hightlightsSlides.map((list, i) => (
					<div key={list.id} id="slider" className="sm:pr-20 pr-10">
						<div className="video__carousel__container relative">
							<div className="w-full h-full flex__center rounded-3xl overflow-hidden bg-black ">
								<video
									className="pointer-events-none"
									id="video"
									muted
									playsInline
									preload="auto"
									ref={(el) => (videoRef.current[i] = el)}
									onPlay={() =>
										setVideo((pre) => ({
											...pre,
											isPlaying: true,
										}))
									}
									onEnded={() => {
										i !== 3
											? handleProcess("video-end", i)
											: handleProcess("video-last");
									}}
									onLoadedMetadata={(e) =>
										handleLoadedMetadata(i, e)
									}
								>
									<source src={list.video} type="video/mp4" />
								</video>
							</div>

							{/* Video's Text Content */}
							<div className="absolute top-12 left-[5%] z-10">
								{list.textLists.map((text, i) => (
									<p
										key={i}
										className="text-xl md:text-2xl font-medium"
									>
										{text}
									</p>
								))}
							</div>
						</div>
					</div>
				))}
			</div>

			{/* CAROUSEL NAVIGATION */}
			<div className="mt-10 relative flex__center">
				<div className="flex__center px-7 py-5 bg-gray-300 rounded-full backdrop-blur">
					{videoRef.current.map((_, i) => (
						<span
							key={i}
							className="mx-2 w-3 h-3 bg-gray-200 rounded-full cursor-pointer relative"
							ref={(el) => (videoDivRef.current[i] = el)}
						>
							<span
								ref={(el) => (videoSpanRef.current[i] = el)}
								className="absolute h-full w-full rounded-full"
							/>
						</span>
					))}
				</div>
				<button className="ml-4 p-4 bg-gray-300 rounded-full  backdrop-blur flex__center ">
					<img
						src={
							isLastVideo
								? replayImg
								: !isPlaying
								? playImg
								: pauseImg
						}
						alt={
							isLastVideo
								? "replay"
								: !isPlaying
								? "play"
								: "pause"
						}
						onClick={
							isLastVideo
								? () => handleProcess("video-reset")
								: !isPlaying
								? () => handleProcess("play")
								: () => handleProcess("pause")
						}
					/>
				</button>
			</div>
		</>
	);
};

export default VideoCarousel;
