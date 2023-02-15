import axios from 'axios';
import { useEffect, useState } from 'react'
import Image from 'next/image'
import styles from '@/styles/Home.module.css'
import Link from 'next/link'

export default function Polychromatic() {

    const [image, setImage] = useState([]);
    const [images, setImages] = useState([]);
    const [time, setTime] = useState("loading");
    const [date, setDate] = useState('');
    const [coords, setCoords] = useState({});

    const apiKey = "jMtzg2hyaPCMgH8Q8YU9OxEvYT7snnUNcFasbzIl"
    const url = `https://epic.gsfc.nasa.gov/api/natural/api_key=${apiKey}`

    const getPolychromaticData = async () => {
        const res = await axios.get(url);
        const data = await res.data;
        console.log(data)

        const caption = data[0].caption;
        const date = data[0].date.split(" ")[0];
        const date_formatted = date.replaceAll("-", "/");

        let times = [];
        let images = [];

        for(let i = 0; i < data.length; i++) {
            let time = data[i].date.split(" ")[1];
            let coords = data[i].centroid_coordinates;
            let imageGrabbed = data[i].image;
            let image = `https://epic.gsfc.nasa.gov/archive/natural/${date_formatted}/png/${imageGrabbed}.png`;

            times.push(time);
            images.push({
                image: image,
                time: time,
                coords: coords
            })
        }

        setDate(date);
        setImages(images);

        setImage(images[0].image);
        setTime(times[0]);
        setCoords(images[0].coords.lat, images[0].coords.lon);

        console.log(image)
    }

    useEffect(() => {
        getPolychromaticData();
    }, [])

  return (
    <>
      <main className={styles.main}>
        <div className={styles.nav}>
          <Link className={styles.navtext} href="/"> <div>Home</div> </Link>
          <Link className={styles.navtext} href="/polychromatic"> <div>Polychromatic</div> </Link>
        </div>

      <h1 className={styles.title}>Polychromatic</h1>

      <Image src={image} alt={image} width={200} height={200} />
      <div className={styles.gap}>{time}</div>
      <div className={styles.gap}>{coords[0]}, {coords[1]}</div>

      <table className={styles.chart}>
        <thead>
            <tr className={styles.columns}>
                <th className={styles.header}>Time</th>
                <th className={styles.header}>Latitude</th>
                <th className={styles.header}>Longitude</th>
                <th className={styles.header}>Image</th>
                <th className={styles.header}>Button</th>
            </tr>
        </thead>
        <tbody>
        {
            images.map((e, i) => {
                return(
                    <tr key={i} className={styles.columns}>
                        <td className={styles.data}>{e.time}</td>
                        <td className={styles.data}>{e.coords.lat}</td>
                        <td className={styles.data}>{e.coords.lon}</td>
                        <td className={styles.image}><Image src={e.image} alt={i} width={100} height={100} /></td>
                        <td>
                            <button className={styles.button} onClick={() => {
                                setImage(e.image);
                                setTime(e.time);
                                setCoords(e.coords.lat, e.coords.lon);
                                console.log(images[i].image)
                                document.body.scrollIntoView();
                            }}>View</button>
                        </td>
                    </tr>
                )
            })
        }
        </tbody>
      </table>
      </main>
    </>
  )
}