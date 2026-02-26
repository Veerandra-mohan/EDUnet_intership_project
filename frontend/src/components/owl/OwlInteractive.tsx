import { useEffect, useRef } from "react";

interface Props {
    isFocused: boolean;
}

export default function OwlInteractive({ isFocused }: Props) {
    const owlRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!owlRef.current) return;

            const pupils = owlRef.current.querySelectorAll(".dynamic-pupil");
            const rect = owlRef.current.getBoundingClientRect();

            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
            const distance = Math.min(
                Math.hypot(e.clientX - centerX, e.clientY - centerY) / 50,
                6
            ); // cap distance for pupil movement

            pupils.forEach((pupil) => {
                (pupil as SVGElement).style.transform = `translate(${Math.cos(angle) * distance
                    }px, ${Math.sin(angle) * distance}px)`;
            });
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    return (
        <div className={`owl-container ${isFocused ? "closed" : ""}`}>
            <svg
                ref={owlRef}
                viewBox="0 0 200 200"
                className="owl-img"
                xmlns="http://www.w3.org/2000/svg"
                style={{ overflow: "visible" }}
            >
                <defs>
                    <clipPath id="left-eye-clip">
                        <circle cx="68" cy="100" r="24" />
                    </clipPath>
                    <clipPath id="right-eye-clip">
                        <circle cx="132" cy="100" r="24" />
                    </clipPath>
                </defs>

                {/* Base Head */}
                <path
                    d="M100,185 C170,145 180,80 180,45 C160,50 135,45 100,60 C65,45 40,50 20,45 C20,80 30,145 100,185 Z"
                    fill="#0A2133"
                />

                {/* Dashed Stitching */}
                <path
                    d="M100,175 C160,140 170,85 170,55 C155,58 135,53 100,67 C65,53 45,58 30,55 C30,85 40,140 100,175 Z"
                    fill="none"
                    stroke="#ffffff"
                    strokeDasharray="4,6"
                    strokeWidth="1.5"
                    opacity="0.4"
                />

                {/* Top Teal Feathers Outer */}
                <path
                    d="M100,60 C140,40 185,25 185,25 C185,25 160,55 125,65 C115,68 105,73 100,85 C95,73 85,68 75,65 C40,55 15,25 15,25 C15,25 60,40 100,60 Z"
                    fill="#0F747B"
                />

                {/* Top Teal Feathers Inner */}
                <path
                    d="M100,75 C125,55 165,38 165,38 C165,38 145,58 115,70 L100,95 L85,70 C55,58 35,38 35,38 C35,38 75,55 100,75 Z"
                    fill="#15999A"
                />

                {/* White Face Background */}
                <path
                    d="M100,85 C115,65 145,55 155,75 C175,105 135,145 100,165 C65,145 25,105 45,75 C55,55 85,65 100,85 Z"
                    fill="#ffffff"
                />

                {/* Shadow detail on white face (optional for depth) */}
                <path
                    d="M100,165 C135,145 175,105 155,75 C145,55 115,65 100,85 C85,65 55,55 45,75 C25,105 65,145 100,165 Z"
                    fill="none"
                    stroke="#DDF0F5"
                    strokeWidth="8"
                    opacity="0.5"
                />

                {/* Beak */}
                <path
                    d="M90,105 L110,105 L100,135 Z"
                    fill="#0A2133"
                />

                {/* Left Eye Container */}
                <g>
                    {/* The bounds of the eye socket could just be inferred. We simply render the animated pupil. */}
                    {/* The dark blue circle itself moves a little bit */}
                    <g className="dynamic-pupil" style={{ transition: "transform 0.1s ease-out" }}>
                        <circle cx="68" cy="100" r="22" fill="#0A2133" />
                        {/* Highlights */}
                        <circle cx="74" cy="94" r="6" fill="#ffffff" />
                        <circle cx="62" cy="106" r="2" fill="#ffffff" />
                    </g>
                    {/* Eyelid (drops down when focused) */}
                    <path
                        className="eyelid-svg"
                        d="M40,70 Q68,60 96,70 L96,120 L40,120 Z"
                        fill="#15999A"
                        clipPath="url(#left-eye-clip)"
                        style={{
                            transform: isFocused ? "translateY(0)" : "translateY(-100px)",
                            transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        }}
                    />
                </g>

                {/* Right Eye Container */}
                <g>
                    <g className="dynamic-pupil" style={{ transition: "transform 0.1s ease-out" }}>
                        <circle cx="132" cy="100" r="22" fill="#0A2133" />
                        {/* Highlights */}
                        <circle cx="138" cy="94" r="6" fill="#ffffff" />
                        <circle cx="126" cy="106" r="2" fill="#ffffff" />
                    </g>
                    {/* Eyelid */}
                    <path
                        className="eyelid-svg"
                        d="M104,70 Q132,60 160,70 L160,120 L104,120 Z"
                        fill="#15999A"
                        clipPath="url(#right-eye-clip)"
                        style={{
                            transform: isFocused ? "translateY(0)" : "translateY(-100px)",
                            transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        }}
                    />
                </g>
            </svg>
        </div>
    );
}
