
"use client";
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Minus, Plus, SunMedium } from "lucide-react";

// Example months data — replace with your dynamic data as needed
const months = [
    { month: "December", year: 2025, temp: "21.1°C", price: 422 },
    { month: "January", year: 2026, temp: "18.9°C", price: 381 },
    { month: "February", year: 2026, temp: "19.4°C", price: 381 },
    { month: "March", year: 2026, temp: "22.2°C", price: 381 },
    { month: "April", year: 2026, temp: "26.7°C", price: 394 },
    { month: "May", year: 2026, temp: "30.6°C", price: 394 },
];

const monthsRight = [
    { month: "June", year: 2026, temp: "32.8°C", price: 394 },
    { month: "July", year: 2026, temp: "35°C", price: 474 },
    { month: "August", year: 2026, temp: "35°C", price: 473 },
    { month: "September", year: 2026, temp: "32.8°C", price: 469 },
    { month: "October", year: 2026, temp: "29.4°C", price: 468 },
];

export default function CheapFlights() {

    const [nights, setNights] = useState(7);

    const incrementNights = () => {
        setNights((prev) => prev + 1);
    };

    const decrementNights = () => {
        if (nights > 1) {
            setNights((prev) => prev - 1);
        }
    };

    return (
        <div className="w-full px-4 py-10">
            <h1 className="text-3xl md:text-4xl font-bold text-center text-primary mb-2 uppercase tracking-wide">
                Cheap Return Flights From London to Dubai
            </h1>

            <p className="text-center text-gray-600 mb-6 text-lg">Find the best deals</p>

            {/* Nights Selector */}
            <div className="flex items-center justify-center gap-3 mb-10">

                <span className="text-gray-700 font-medium">Return in</span>

                <div className="flex items-center border rounded-lg overflow-hidden">

                    <Button className="px-3" onClick={decrementNights} ><Minus size={16} /></Button>

                    <span className="px-4 py-2 font-semibold text-lg">{nights}</span>

                    <Button className="px-3" onClick={incrementNights}><Plus size={16} /></Button>
                </div>

                <span className="text-gray-700 font-medium">nights</span>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-7xl mx-auto">
                {/* LEFT */}
                <div className="space-y-4">
                    {months.map((m, idx) => (
                        <Card key={idx} className="shadow-md border">
                            <CardContent className="flex items-center justify-between p-4">
                                <div>
                                    <p className="font-semibold text-gray-800">{m.month} {m.year}</p>
                                    <p className="text-sm text-gray-600 flex  gap-1 items-center"><SunMedium size={20}
                                        className="text-yellow-600"
                                    /> {m.temp}</p>
                                </div>
                                <div className="">
                                    <p className="text-sm text-gray-600">from</p>
                                    <p className="font-bold text-lg">£{m.price}<span className="text-gray-500 text-sm">pp</span></p>
                                </div>
                                <Button className="bg-green-600 hover:bg-green-700 text-white px-5 py-1 rounded-md">View prices</Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* RIGHT */}
                <div className="space-y-4">
                    {monthsRight.map((m, idx) => (
                        <Card key={idx} className="shadow-md border ">
                            <CardContent className="flex items-center justify-between p-4">
                                <div>
                                    <p className="font-semibold text-gray-800">{m.month} {m.year}</p>
                                    <p className="text-sm text-gray-600 flex items-center gap-1"><SunMedium size={20}
                                        className="text-yellow-600"
                                    />  {m.temp}</p>
                                </div>
                                <div className="">
                                    <p className="text-sm text-gray-600">from</p>
                                    <p className="font-bold text-lg">£{m.price}<span className="text-gray-500 text-sm">pp</span></p>
                                </div>
                                <Button className="bg-green-600 hover:bg-green-700 text-white px-5 py-1 rounded-md">View prices</Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            <p className="text-center text-gray-500 text-sm mt-6">
                All prices shown are per person based on return flights only. Prices found in the last 48 hours.
            </p>
        </div>
    );
}
