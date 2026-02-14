import React, { FC } from "react";

interface Props {
  landingPageTips: [],
  destination: any
}
const LondonToDubaiGuide: FC<Props> = ({ landingPageTips, destination }) => {
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-10 text-gray-800">
      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-bold text-center text-primary mb-3">
        HOW TO GET CHEAP FLIGHTS FROM {destination?.from?.toUpperCase()} TO {destination?.destination?.toUpperCase()}
      </h1>
      <p className="text-center text-xl italic mb-10 text-gray-600">
        Tips and advice from our flight experts
      </p>

      {/* Section 1 */}
      {landingPageTips?.length > 0 && landingPageTips.map((tip: any, index) => {
        return (
          <div key={index}>
            <h2 className="text-2xl font-semibold mb-4">
              {tip.title}
            </h2>
            <p className="mb-4 leading-relaxed">
              {tip.description}
            </p>
          </div>
        )
      })}
    </div>
  );
}

export default LondonToDubaiGuide;