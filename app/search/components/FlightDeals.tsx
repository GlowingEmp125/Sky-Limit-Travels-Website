
"use client";
import React, { FC, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { QuickCustomerBasicInfoModal } from "./quick-customer-basic-info-modal";

// Example flight deals data
const deals = [
  {
    airlineLogo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUUpDipSVClCKWAM5O2krqGSWqal5XGeztdQ&s", // replace with your image
    outbound: {
      from: "LGW",
      fromCity: "London",
      date: "26 Nov 25",
      to: "DXB",
      toCity: "Dubai",
      stops: "1 Stop BAH",
    },
    inbound: {
      from: "DXB",
      fromCity: "Dubai",
      date: "04 Dec 25",
      to: "LGW",
      toCity: "London",
      stops: "1 Stop BAH",
    },
    nights: 8,
    price: 362,
  },
  {
    airlineLogo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUUpDipSVClCKWAM5O2krqGSWqal5XGeztdQ&s",
    outbound: {
      from: "LHR",
      fromCity: "London",
      date: "30 Nov 25",
      to: "DXB",
      toCity: "Dubai",
      stops: "1 Stop BAH",
    },
    inbound: {
      from: "DXB",
      fromCity: "Dubai",
      date: "03 Dec 25",
      to: "LHR",
      toCity: "London",
      stops: "1 Stop BAH",
    },
    nights: 3,
    price: 387,
  },
  {
    airlineLogo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUUpDipSVClCKWAM5O2krqGSWqal5XGeztdQ&s",
    outbound: {
      from: "LGW",
      fromCity: "London",
      date: "26 Nov 25",
      to: "DXB",
      toCity: "Dubai",
      stops: "1 Stop BAH",
    },
    inbound: {
      from: "DXB",
      fromCity: "Dubai",
      date: "02 Dec 25",
      to: "LGW",
      toCity: "London",
      stops: "1 Stop BAH",
    },
    nights: 6,
    price: 413,
  },
  {
    airlineLogo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSPbYXlf6ig48wkT_J9U4_ndpedPAF-AhtEA&s",
    outbound: {
      from: "LCY",
      fromCity: "London",
      date: "27 Nov 25",
      to: "DXB",
      toCity: "Dubai",
      stops: "1 Stop AMS",
    },
    inbound: {
      from: "DXB",
      fromCity: "Dubai",
      date: "04 Dec 25",
      to: "LCY",
      toCity: "London",
      stops: "1 Stop AMS",
    },
    nights: 7,
    price: 442,
  },
];
interface Props {
  landingPageDestinations: []
}

const FlightDeals: FC<Props> = ({ landingPageDestinations }) => {

  const [openModal, setOpenModal] = useState(false);

  const [currentDeal, setCurrentDeal] = useState<any>(null);

  const handleOpen = (deal: any) => {
    setCurrentDeal(deal);
    setOpenModal(true);
  }
  const handleClose = () => {
    setOpenModal(false);
    setCurrentDeal(null);
  }

  return (
    <div className="w-full px-4 py-14 bg-gray-50">
      <h1 className="text-3xl md:text-4xl font-bold text-center text-primary mb-2 uppercase tracking-wide">
        Cheap Flight Deals For This Route
      </h1>

      <p className="text-center text-gray-600 mb-10 text-lg italic">
        See what's hot at the moment
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-7xl mx-auto">
        {deals.map((d, idx) => (
          <Card key={idx} className="shadow-md border overflow-hidden">
            <CardContent className="p-0">
              <div className="flex items-center gap-5 p-5 border-b">
                <Image
                  src={d.airlineLogo}
                  alt="airline logo"
                  width={60}
                  height={60}
                  className="object-contain"
                />
                <div className="flex-1 grid grid-cols-3 text-sm">
                  <div>
                    <p className="text-xl font-bold">{d.outbound.from}</p>
                    <p className="text-gray-500">{d.outbound.fromCity}</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <p className="text-primary font-medium">{d.outbound.date}</p>
                    <div className="flex items-center gap-2 text-primary font-medium mt-1">
                      <span>{d.outbound.stops}</span>
                      <ArrowRight size={20} />
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold">{d.outbound.to}</p>
                    <p className="text-gray-500">{d.outbound.toCity}</p>
                  </div>
                </div>
              </div>

              {/* INBOUND */}
              <div className="flex items-center gap-5 p-5 border-b">
                <Image
                  src={d.airlineLogo}
                  alt="airline logo"
                  width={60}
                  height={60}
                  className="object-contain"
                />
                <div className="flex-1 grid grid-cols-3 text-sm">
                  <div>
                    <p className="text-xl font-bold">{d.inbound.from}</p>
                    <p className="text-gray-500">{d.inbound.fromCity}</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <p className="text-sky-600 font-medium">{d.inbound.date}</p>
                    <div className="flex items-center gap-2 text-sky-600 font-medium mt-1">
                      <span>{d.inbound.stops}</span>
                      <ArrowRight size={20} />
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold">{d.inbound.to}</p>
                    <p className="text-gray-500">{d.inbound.toCity}</p>
                  </div>
                </div>
              </div>

              {/* PRICE + BUTTON */}
              <div className="flex items-center justify-between p-5 bg-gray-100">
                <div>
                  <p className="text-gray-600 text-sm">{d.nights} nights</p>
                  <p className="font-bold text-lg">only £{d.price}pp</p>
                </div>
                <Button className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-md" onClick={handleOpen}>
                  Get Deal...
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-center mt-8">
        <Button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md text-lg">
          show more deals
        </Button>
      </div>
      <QuickCustomerBasicInfoModal open={openModal} onClose={handleClose} />
    </div>
  );
}

export default FlightDeals;