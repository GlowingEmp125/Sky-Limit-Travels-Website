
"use client";
import React, { FC, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { QuickCustomerBasicInfoModal } from "./quick-customer-basic-info-modal";
import { formatDate } from "@/lib/utils";

// Example flight deals data

interface Props {
  landingPageDestinations: []
}

const FlightDeals: FC<Props> = ({ landingPageDestinations }) => {

  const [openModal, setOpenModal] = useState(false);

  const [currentDeal, setCurrentDeal] = useState<any>();

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

        {landingPageDestinations?.map((destination: any, index: number) => {
          return (
            <Card key={index} className="shadow-md border overflow-hidden">
              <CardContent className="p-0">
                <div className="flex items-center gap-5 p-5 border-b">
                  <Image
                    src={destination.destinationImage}
                    alt="airline logo"
                    width={60}
                    height={60}
                    className="object-contain"
                  />
                  <div className="flex-1 grid grid-cols-3 text-sm">
                    <div>
                      <p className="text-xl font-bold">{destination.from}</p>
                      {/* <p className="text-gray-500">{d.outbound.fromCity}</p> */}
                    </div>
                    <div className="flex flex-col items-center">
                      <p className="text-primary font-medium">{formatDate(destination.date)}</p>
                      <div className="flex items-center gap-2 text-primary font-medium mt-1">
                        <span>{destination.stops}</span>
                        <ArrowRight size={20} />
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold">{destination.destination}</p>
                      {/* <p className="text-gray-500">{d.outbound.toCity}</p> */}
                    </div>
                  </div>
                </div>

                {/* INBOUND */}
                <div className="flex items-center gap-5 p-5 border-b">
                  <Image
                    src={destination.returnDestinationImage}
                    alt="airline logo"
                    width={60}
                    height={60}
                    className="object-contain"
                  />
                  <div className="flex-1 grid grid-cols-3 text-sm">
                    <div>
                      <p className="text-xl font-bold">{destination.returnFrom}</p>
                      {/* <p className="text-gray-500">{d.inbound.fromCity}</p> */}
                    </div>
                    <div className="flex flex-col items-center">
                      <p className="text-sky-600 font-medium">{formatDate(destination.returnDate)}</p>
                      <div className="flex items-center gap-2 text-sky-600 font-medium mt-1">
                        <span>{destination.returnStops}</span>
                        <ArrowRight size={20} />
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold">{destination.returnDestination}</p>
                      {/* <p className="text-gray-500">{d.inbound.toCity}</p> */}
                    </div>
                  </div>
                </div>

                {/* PRICE + BUTTON */}
                <div className="flex items-center justify-between p-5 bg-gray-100">
                  <div>
                    <p className="text-gray-600 text-sm">{destination.duration} nights</p>
                    <p className="font-bold text-lg">only £{destination.price}pp</p>
                  </div>
                  <Button className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-md"
                   onClick={() => handleOpen(destination)}>
                    Get Deal...
                  </Button>
                </div>
              </CardContent>
            </Card>

          )
        })}
      </div>

      {/* <div className="flex justify-center mt-8">
        <Button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md text-lg">
          show more deals
        </Button>
      </div> */}
      <QuickCustomerBasicInfoModal open={openModal} onClose={handleClose} currentDeal={currentDeal} />
    </div>
  );
}

export default FlightDeals;