import React, { useState } from "react";
import population_by_district from "../data/population_by_district.json";
import densityData from "../data/population_density_by_district.json";
import styles from "./analysis.module.css";

const Analysis = () => {
    const [selectedDistrict, setSelectedDistrict] = useState("전체");

    const handleClick = (districtName) => {
        setSelectedDistrict(districtName);
    };

    const selectedData =
        selectedDistrict !== "전체"
            ? population_by_district.find((item) => item.district === selectedDistrict)
            : null;

    const selectedDensity =
        selectedDistrict !== "전체"
            ? densityData.find((item) => item.district === selectedDistrict)
            : null;

    const filteredPopulation =
        selectedDistrict === "전체"
            ? population_by_district
            : population_by_district.filter((item) => item.district === selectedDistrict);

    return (
        <section className={styles.wrapper}>
            <h1 className={styles.title}>부산시 인구 통계 분석</h1>
            <p className={styles.description}>
                구를 선택하면 상세한 인구 및 밀도 데이터를 확인할 수 있습니다.
            </p>

            <div className={styles.dashboard}>
                {/* 좌측: 구 선택 탭 */}
                <div className={styles.sidebar}>
                    {['전체', ...population_by_district.map((item) => item.district)].map((district) => (
                        <button
                            key={district}
                            onClick={() => handleClick(district)}
                            className={`${styles.tabItem} ${selectedDistrict === district ? styles.activeTab : ''}`}
                        >
                            {district}
                        </button>
                    ))}
                </div>

                {/* 우측: 표 및 상세 정보 */}
                <div className={styles.content}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>구군명</th>
                                <th>총 인구 수</th>
                                <th>면적 (km²)</th>
                                <th>인구 밀도 (명/km²)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPopulation.map((item) => {
                                const densityItem = densityData.find((d) => d.district === item.district);
                                return (
                                    <tr
                                        key={item.district}
                                        className={item.district === selectedDistrict ? styles.highlightRow : ''}
                                    >
                                        <td>{item.district}</td>
                                        <td>{item.total_population.toLocaleString()}명</td>
                                        <td>{item.area}</td>
                                        <td>
                                            {densityItem
                                                ? `${densityItem.population_density.toLocaleString()}명/km²`
                                                : "데이터 없음"}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                </div>
            </div>
        </section>
    );
};

export default Analysis;
