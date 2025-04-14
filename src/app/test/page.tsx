"use client";

import { useEffect, useState } from "react";
import api from "@/utils/api";
export default function Page() {
    const [data, setData] = useState("Ładowanie...");

    useEffect(() => {
        api.get("/test")
            .then((res) => setData(res.data))
            .catch((err) => {
                console.error("Error fetching data:", err);
                setData("Błąd pobierania danych");
            });
    }, []);

    return (
        <main>
            <p>{data}</p>
        </main>
    );
}
