import { useState, useRef, useEffect } from "react"
import BusanSvg from "../assets/Busan.svg?react"
import guName from "../data/gu_name.json"
import lamp from "../data/lamp_count.json"
import population from "../data/population_by_district.json"
import styles from "./analysis.module.css"
import axios from "axios"
import { Bar } from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js"
import { motion, AnimatePresence } from "framer-motion"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const Analysis = () => {
    const [centers, setCenters] = useState([])
    const svgContainerRef = useRef(null)
    const svgWrapperRef = useRef(null)

    const [chartData, setChartData] = useState({
        labels: [],
        datasets: []
    })

    const [selectedDistrict, setSelectedDistrict] = useState(null)
    const [selectedDistrictId, setSelectedDistrictId] = useState(null)
    const [activeTab, setActiveTab] = useState(1)

    const totalPopulation = population.reduce((sum, cur) => sum + (cur.total_population || 0), 0)
    const totalLamps = lamp.reduce((sum, cur) => sum + (cur.lamp_count || 0), 0)

    useEffect(() => {
        setSelectedDistrict({
            name: "부산광역시 전체",
            population: totalPopulation,
            lamps: totalLamps
        })
    }, [totalPopulation, totalLamps])

    useEffect(() => {
        const handleClickInside = (e) => {
            if (e.target.tagName.toLowerCase() === "path") {
                return
            }

            if (
                svgWrapperRef.current &&
                svgWrapperRef.current.contains(e.target)
            ) {
                setSelectedDistrict({
                    name: "부산광역시 전체",
                    population: totalPopulation,
                    lamps: totalLamps,
                })
                setSelectedDistrictId(null)
            }
        }

        document.addEventListener("click", handleClickInside, true)
        return () => document.removeEventListener("click", handleClickInside, true)
    }, [totalPopulation, totalLamps])

    useEffect(() => {
        axios.get("/api/posts/public")
            .then(res => {
                const allDistricts = [
                    '중구', '서구', '동구', '영도구', '부산진구', '동래구', '남구',
                    '북구', '해운대구', '사하구', '금정구', '강서구', '연제구', '수영구',
                    '사상구', '기장군'
                ]
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
                    datasets: [{
                        label: "제보 수",
                        data: fullCounts.map(d => d.count),
                        backgroundColor: "rgba(255,214,107,1)",
                        borderRadius: 4
                    }]
                })
            })
            .catch(err => console.error("데이터 불러오기 실패:", err))
    }, [])

    useEffect(() => {
        if (!svgContainerRef.current) return
        const paths = svgContainerRef.current.querySelectorAll("path")
        const newCenters = []

        paths.forEach((path) => {
            const bbox = path.getBBox()
            const cx = bbox.x + bbox.width / 2
            const cy = bbox.y + bbox.height / 2

            path.style.cursor = "pointer"
            path.style.position = "absolute"

            path.onclick = (e) => {
                e.stopPropagation()
                const districtId = path.id
                const renamed = guName.find(item => item.district === districtId)?.rename
                if (!renamed) return

                const populationData = population.find(item => item.district === renamed)?.total_population || 0
                const lampData = lamp.find(item => item.district === renamed)?.lamp_count || 0

                setSelectedDistrict({
                    name: renamed,
                    population: populationData,
                    lamps: lampData,
                })
                setSelectedDistrictId(districtId)
            }

            newCenters.push({ id: path.id, cx, cy })
        })

        setCenters(newCenters)
    }, [])

    useEffect(() => {
        if (!svgContainerRef.current) return
        const paths = svgContainerRef.current.querySelectorAll("path")
        console.log(paths)

        paths.forEach((path) => {
            if (path.id === selectedDistrictId) {
                path.style.opacity = "1"
                path.style.transition = "all 0.3s"
            } else {
                path.style.opacity = "0.6"
                path.style.transition = "all 0.3s"
            }
        })
    }, [selectedDistrictId])

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: false
            },
            title: {
                display: true,
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: { stepSize: 1 }
            }
        }
    }

    return (
        <div className={styles.analysisWrapper}>
            <h2>부산시 안전 구역</h2>

            <div className={styles.BusanMap} ref={svgWrapperRef} style={{ position: "relative" }}>
                <div ref={svgContainerRef}>
                    <BusanSvg className={styles.map} />
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
                                userSelect: "none"
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

            <div className={styles.tabWrapper}>
                <div className={styles.tabButtons}>
                    <button
                        className={activeTab === 1 ? styles.activeTab : ""}
                        onClick={() => setActiveTab(activeTab === 1 ? null : 1)}
                    >
                        실시간 제보 현황
                    </button>

                    <AnimatePresence mode="wait">
                        {activeTab === 1 && (
                            <motion.div
                                className={styles.tabContent}
                                key="tab1"
                                initial={{ height: 0, opacity: 0, y: -20 }}
                                animate={{ height: "auto", opacity: 1, y: 0 }}
                                exit={{ height: 0, opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className={styles.PostChart}>
                                    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
                                        <Bar data={chartData} options={chartOptions} />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <button
                        className={activeTab === 2 ? styles.activeTab : ""}
                        onClick={() => setActiveTab(activeTab === 2 ? null : 2)}
                    >
                        인구수 대비 보안등 현황
                    </button>

                    <AnimatePresence mode="wait">
                        {activeTab === 2 && (
                            <motion.div
                                className={styles.tabContent}
                                key="tab2"
                                initial={{ height: 0, opacity: 0, y: -20 }}
                                animate={{ height: "auto", opacity: 1, y: 0 }}
                                exit={{ height: 0, opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                {selectedDistrict ? (
                                    <div className={styles.secondInfo}>
                                        <strong>{selectedDistrict.name}</strong>
                                        <p>
                                            보안등 1개당 인구 수:{" "}
                                            {selectedDistrict.lamps > 0
                                                ? (selectedDistrict.population / selectedDistrict.lamps).toFixed(1).toLocaleString() + "명"
                                                : "데이터 없음"}
                                        </p>
                                        <p>인구 수: {selectedDistrict.population.toLocaleString()}명</p>
                                        <p>보안등 수: {selectedDistrict.lamps.toLocaleString()}개</p>
                                    </div>
                                ) : (
                                    <p style={{ textAlign: "center", marginTop: "20px" }}>
                                        지도를 클릭하면 해당 구의 정보가 여기 표시됩니다.
                                    </p>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    )
}

export default Analysis
