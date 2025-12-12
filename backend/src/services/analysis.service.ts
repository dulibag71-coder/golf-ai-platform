export const analyzeSwing = async (keypoints: any) => {
    // Mock Analysis Logic
    // In a real system, this would calculate angles between joints based on keypoints

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const randomScore = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

    return {
        score_total: randomScore(70, 95),
        score_stability: randomScore(70, 90),
        score_path: randomScore(80, 95),
        score_impact: randomScore(75, 95),
        score_weight_transfer: randomScore(60, 85),
        score_release: randomScore(70, 90),
        score_consistency: randomScore(70, 90),
        diagnosis_problems: ["얼리 익스텐션 (배치기)", "스웨이 (상체 흔들림)"],
        diagnosis_good_point: "백스윙 회전이 아주 좋습니다",
        injury_risk_warning: "허리 부상 위험이 있으니 코어에 힘을 주세요"
    };
};
