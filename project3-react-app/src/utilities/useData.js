import { useState, useEffect } from "react";
import { csv } from "d3";

export const useData = ({ url }) => {
    // console.log(url)
    const [data, setData] = useState(null);

    useEffect(() => {
        const row = d => {
            d.Year = +d.Year;
            d.Body_Count = +d.Body_Count;
            d.Genre = d.Genre.split("|");
            d.Length_Minutes = +d.Length_Minutes;
            d.IMDB_Rating = +d.IMDB_Rating

            return d
        }
        csv(url, row).then(setData)
    }, [url])

    return data;
}