import React from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

import VideoCarousel from "./components/VideoCarousel";

import { rightImg, watchImg } from "./utils";

const App = () => {
	useGSAP(() => {
		gsap.to("#title", {
			opacity: 1,
			y: 0,
		});
		gsap.to(".link", {
			opacity: 1,
			y: 0,
			delay: 0.1,
			stagger: 0.2,
		});
	});

	return (
		<main className="w-full h-full overflow-hidden common__padding">
			{/* TEXT CONTENT */}
			<div className="w-full md:flex justify-between items-end ">
				{/* title */}
				<h1 id="title" className="section__heading">
					Get the highlights
				</h1>
				{/* links items */}
				<div className="flex flex-wrap items-end gap-5">
					<p className="link">
						Watch the film
						<img src={watchImg} alt="watch" className="ml-2" />
					</p>
					<p className="link">
						Watch the event
						<img src={rightImg} alt="right" className="ml-2" />
					</p>
				</div>
			</div>

			<VideoCarousel />
		</main>
	);
};

export default App;
