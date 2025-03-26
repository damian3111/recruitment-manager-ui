// export default async function Page() {
//
//     const response = await fetch('http://localhost:8080/test');
//
//     const data = await response.text();
//     console.log("data");
//     console.log(data);
//
//
//
//     return (
//         <main>
//             <p>{data}</p>
//         </main>
//     )
// }

//
// import axios from "axios";
//
// export default async function Page() {
//     const response = await  axios.get('http://localhost:8080/test');
//
//     const data = response.data;
//     console.log("data");
//     console.log(data);
//
//     return (
//         <main>
//             <p>{data}</p>
//         </main>
//     )
// }


// import axios from "axios";
// import api from "@/utils/api";  // ✅ Correct
//
// export default async function Page() {
//     try {
//         const response = await api.get<string>("/test"); // ✅ Specify expected response type
//
//         // const response = await axios.get("http://localhost:8080/test");
//         const data = response.data; // ✅ Use `.data`, NOT `.data()`
//
//         console.log("data", data);
//
//         return (
//             <main>
//                 <p>{data}</p>
//             </main>
//         );
//     } catch (error) {
//         console.error("Error fetching data:", error);
//
//         return (
//             <main>
//                 <p>Error fetching data</p>
//             </main>
//         );
//     }
// }




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
