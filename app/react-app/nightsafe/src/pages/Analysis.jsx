import React, { useState, useRef, useEffect } from "react"
import BusanSvg from "../assets/Busan.svg?react"
import population_by_district from "../data/population_by_district.json"
import guName from "../data/gu_name.json"
import styles from "./analysis.module.css"

const Analysis = () => {
    const [clickGu, setClickGu] = useState("all")
    const [activeTab, setActiveTab] = useState("tab1")
    const [centers, setCenters] = useState([]) // 각 구 중심 좌표 배열
    const [activeGuId, setActiveGuId] = useState(null)

    const svgContainerRef = useRef(null) // BusanSvg 감싸는 div ref

    const handleGuClick = (event) => {
        const guId = event.target.id
        const match = guName.find((item) => item.district === guId)
        setClickGu(match ? match.rename : guId)
        setActiveGuId(guId)
    }

    const selectedGu =
        clickGu !== "all"
            ? guName.find((item) => item.district === clickGu)
            : null

    const population =
        clickGu !== "all"
            ? population_by_district.find((item) => item.district === clickGu)
            : null

    const handleTabClick = (tabId) => {
        setActiveTab(tabId)
    }

    useEffect(() => {
    if (!svgContainerRef.current) return
        const paths = svgContainerRef.current.querySelectorAll("path")

        paths.forEach((path) => {
        if (path.id === activeGuId) {
            path.style.fill = "#FFD75E"
        } else {
            path.style.fill = "#C8C8C8"
        }
        })
    }, [activeGuId])

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
            <h2>부산시 인구 및 인구 밀도 분석</h2>

            <div
                className={styles.BusanMap}
                style={{ position: "relative" }}
            >
                <div ref={svgContainerRef}>
                    <BusanSvg
                        onClick={handleGuClick}
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
            </div>

            <div className={styles.dataTabs}>
                <button
                    className={styles.tabButton}
                    onClick={() => handleTabClick("tab1")}
                >
                    <p>1번탭</p>
                </button>
                <div
                    className={`${styles.tabinner} ${activeTab === "tab1" ? styles.active : ""}`}
                >
                    {clickGu && (
                    <div className={styles.infoBox}>
                        <h3>{selectedGu ? selectedGu.rename : clickGu}</h3>
                        <p>
                            <strong>인구:</strong>{" "}
                            {population
                                ? `${population.total_population.toLocaleString()}명`
                                : "데이터 없음"}
                        </p>
                    </div>
                )}
                </div>

                <button
                    className={styles.tabButton}
                    onClick={() => handleTabClick("tab2")}
                >
                    <p>2번탭</p>
                </button>
                <div
                    className={`${styles.tabinner} ${activeTab === "tab2" ? styles.active : ""}`}
                >
                    <p>2</p>
                </div>

                <button
                    className={styles.tabButton}
                    onClick={() => handleTabClick("tab3")}
                >
                    <p>3번탭</p>
                </button>
                <div
                    className={`${styles.tabinner} ${activeTab === "tab3" ? styles.active : ""}`}
                >
                    <p>3</p>
                </div>
            </div>
        </div>
    )
}

export default Analysis