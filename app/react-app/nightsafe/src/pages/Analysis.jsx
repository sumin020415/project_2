import { useState, useRef, useEffect } from "react"
import BusanSvg from "../assets/Busan.svg?react"
import guName from "../data/gu_name.json"
import styles from "./analysis.module.css"
import axios from "axios"
import { Bar } from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'

// Chart.js 컴포넌트 등록
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
)

const Analysis = () => {
    const [centers, setCenters] = useState([]) // 각 구 중심 좌표 배열
    const [address, setAddress] = useState([])

    const svgContainerRef = useRef(null) // BusanSvg 감싸는 div ref

    const [chartData, setChartData] = useState({
        labels: [],
        datasets: []
    }) // chart에 넣을 데이터

    useEffect(() => {
        // 로그인 여부 상관없이 public API 사용
        axios.get("/api/posts/public")
            .then(res => {
                const allDistricts = ['중구', '서구', '동구', '영도구', '부산진구', '동래구', '남구', '북구', '해운대구', '사하구', '금정구', '강서구', '연제구', '수영구', '사상구', '기장군']
                const districts = res.data.map(v => v.address?.split(" ")[1]).filter(Boolean)
                const districtCounts = {}

                districts.forEach(name => {
                    districtCounts[name] = (districtCounts[name] || 0) + 1
                })

                const fullCounts = allDistricts.map(name => ({
                    name,
                    count: districtCounts[name] || 0
                })).sort((a, b) => b.count - a.count)

                setChartData({
                    labels: fullCounts.map(d => d.name),
                    datasets: [
                        {
                            label: "제보 수",
                            data: fullCounts.map(d => d.count),
                            backgroundColor: "rgba(255,214,107,1)",
                            borderRadius: 4
                        }
                    ]
                })
            })
            .catch(err => console.error("데이터 불러오기 실패:", err));
    }, [])



    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: false
            },
            title: {
                display: true,
                text: "실시간 제보 현황"
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1
                }
            }
        }
    }

    useEffect(() => {
        // 로그인 여부 상관없이 public API 사용
        axios.get("/api/posts/public")
            .then(res => setAddress(res.data.map((v) => v.address?.split(" ")[1])))
            .catch(err => console.error("데이터 불러오기 실패:", err));
    }, []);

    useEffect(() => {
        if (!svgContainerRef.current) return
        const paths = svgContainerRef.current.querySelectorAll("path")
        const newCenters = []

        paths.forEach((path) => {
            const bbox = path.getBBox()
            const cx = bbox.x + bbox.width / 2
            const cy = bbox.y + bbox.height / 2
            newCenters.push({
                id: path.id,
                cx,
                cy,
            })
        })

        setCenters(newCenters)
    }, [])

    return (
        <div className={styles.analysisWrapper}>
            <h2>부산시 안전 구역</h2>

            <div
                className={styles.BusanMap}
                style={{ position: "relative" }}
            >
                <div ref={svgContainerRef}>
                    <BusanSvg
                        className={styles.map}
                    />
                </div>

                {centers.map((center) => {
                    const nameObj = guName.find(item => item.district === center.id)
                    if (!nameObj) return null

                    return (
                        <div
                            key={center.id}
                            style={{
                                position: "absolute",
                                left: `${center.cx}px`,
                                top: `${center.cy}px`,
                                transform: "translate(-50%, -50%)",
                                pointerEvents: "none",
                                fontSize: "14px",
                                padding: "2px 4px",
                                borderRadius: "3px",
                                userSelect: "none",
                            }}
                        >
                            {nameObj.rename}
                        </div>
                    )
                })}
                <div className={`${styles.fixbox} ${styles.danger}`}>
                    <div className={styles.circle}></div>
                    <p>위험 지역</p>
                </div>
                <div className={`${styles.fixbox} ${styles.safe}`}>
                    <div className={styles.circle}></div>
                    <p>안전 지역</p>
                </div>
            </div>

            <div className={styles.PostChart}>
                <div style={{ maxWidth: "600px", margin: "0 auto" }}>
                    <Bar data={chartData} options={chartOptions}></Bar>
                </div>
            </div>
        </div>
    )
}

export default Analysis