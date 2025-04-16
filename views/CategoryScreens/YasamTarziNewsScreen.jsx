import React, { useState, useEffect } from "react";
import { View, ScrollView, Text, StyleSheet, Dimensions } from "react-native";
import { getArticlesByCategory } from "../../utils/articleAPI";
import Header from "../../components/Header";
import CategoryBar from "../../components/CategoryBar";
import BottomNav from "../../components/BottomNav";

const isPortrait = () => {
    const { width, height } = Dimensions.get("window");
    return height >= width;
};

const YasamTarziNewsScreen = ({ navigation }) => {
    const [newsData, setNewsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [portrait, setPortrait] = useState(isPortrait());

    useEffect(() => {
        fetchYasamTarziNews();
        const updateOrientation = () => setPortrait(isPortrait());
        const subscription = Dimensions.addEventListener("change", updateOrientation);
        return () => subscription?.remove();
    }, []);

    const fetchYasamTarziNews = async () => {
        setLoading(true);
        const data = await getArticlesByCategory("Yaşam Tarzı");
        setNewsData(data);
        setLoading(false);
    };

    const sortNewsByPriorityAndSize = (data) => {
        const priorityOrder = { high: 1, medium: 2, low: 3 };
        return [...data].sort((a, b) => {
            if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
                return priorityOrder[a.priority] - priorityOrder[b.priority];
            }
            const summaryLengthA = a.summary ? a.summary.length : 0;
            const summaryLengthB = b.summary ? b.summary.length : 0;
            return summaryLengthA - summaryLengthB;
        });
    };

    const assignNewsSizes = (data) => {
        const total = data.length;
        const xl = Math.ceil(total * 0.1);
        const lg = Math.ceil(total * 0.15);
        const md = Math.ceil(total * 0.25);
        const sm = Math.ceil(total * 0.3);

        return data.map((item, index) => {
            if (index < xl) return { ...item, size: "xl" };
            if (index < xl + lg) return { ...item, size: "large" };
            if (index < xl + lg + md) return { ...item, size: "medium" };
            if (index < xl + lg + md + sm) return { ...item, size: "small" };
            return { ...item, size: "xs" };
        });
    };

    const getFontSize = (size) => {
        switch (size) {
            case "xl": return { title: 20, summary: 13 };
            case "large": return { title: 19, summary: 12.7 };
            case "medium": return { title: 18, summary: 12.3 };
            case "small": return { title: 16, summary: 12 };
            default: return { title: 14, summary: 10 };
        }
    };

    const renderNewsCard = (item) => {
        const fontSize = getFontSize(item.size);
        return (
            <View style={[styles.newsCard, styles[item.size]]}>
                <Text style={[styles.newsTitle, { fontSize: fontSize.title }]}>{item.title}</Text>
                <View style={styles.horizontalLine} />
                {item.summary && (
                    <Text style={[styles.summaryText, { fontSize: fontSize.summary }]}> {item.summary} </Text>
                )}
                {item.image && <View style={styles.imagePlaceholder}><Text>Image</Text></View>}
            </View>
        );
    };

    const createDynamicColumns = (data, count) => {
        const max = Math.min(count, 3);
        const cols = Array.from({ length: max }, () => []);

        data.forEach((item, i) => {
            const col = i % max;
            if (cols[col].length < 3) cols[col].push(item);
            else cols[(col + 1) % max].push(item);
        });

        return cols;
    };

    const createDynamicRows = (data, max = 3) => {
        const rows = [];
        let curr = [];
        data.forEach((item) => {
            curr.push(item);
            if (curr.length === max) {
                rows.push(curr);
                curr = [];
            }
        });
        if (curr.length > 0) rows.push(curr);
        return rows;
    };

    const columnCount = portrait ? 2 : 3;
    const sortedNewsData = assignNewsSizes(sortNewsByPriorityAndSize(newsData));
    const total = sortedNewsData.length;
    let sec1 = Math.min(Math.ceil(total * 0.3), Math.floor(total / 3));
    let sec3 = Math.min(Math.ceil(total * 0.3), Math.floor(total / 3));
    let sec2 = total - (sec1 + sec3);

    if (total < 6) {
        const equal = Math.ceil(total / 3);
        sec1 = equal;
        sec2 = equal;
        sec3 = total - (sec1 + sec2);
    }

    const colData1 = createDynamicColumns(sortedNewsData.slice(0, sec1), columnCount);
    const colData3 = createDynamicColumns(sortedNewsData.slice(sec1 + sec2), columnCount);
    const rowData = createDynamicRows(sortedNewsData.slice(sec1, sec1 + sec2));

    const renderNewsRow = (row) => {
        const num = row.length;
        const width = 100 / num;
        const lastWidth = 100 - (width * (num - 1));
        return (
            <View key={Math.random()} style={styles.row}>
                {row.map((item, i) => (
                    <View
                        key={item.id}
                        style={[styles.newsItem, { width: `${i === num - 1 ? lastWidth : width}%` }]}
                    >
                        {renderNewsCard(item)}
                    </View>
                ))}
            </View>
        );
    };

    return (
        <View style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={styles.container}>
                <Header />
                <View style={styles.categoryContainer}>
                    <CategoryBar navigation={navigation} />
                </View>
                <View style={styles.section}>
                    <View style={styles.rowContainer}>
                        {colData1.map((col, i) => (
                            <View key={i} style={styles.column}>
                                {col.map((item) => (
                                    <View key={item.id} style={styles.newsItem}>
                                        {renderNewsCard(item)}
                                    </View>
                                ))}
                            </View>
                        ))}
                    </View>
                </View>
                <View style={styles.section}>{rowData.map((row) => renderNewsRow(row))}</View>
                <View style={styles.section}>
                    <View style={styles.rowContainer}>
                        {colData3.map((col, i) => (
                            <View key={i} style={styles.column}>
                                {col.map((item) => (
                                    <View key={item.id} style={styles.newsItem}>
                                        {renderNewsCard(item)}
                                    </View>
                                ))}
                            </View>
                        ))}
                    </View>
                </View>
            </ScrollView>
            <BottomNav navigation={navigation} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: "#f4f4f4",
        paddingHorizontal: 4,
        paddingTop: 10,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    categoryContainer: {
        alignItems: "center",
        marginVertical: 1,
    },
    section: {
        marginBottom: 0,
    },
    rowContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    column: {
        flex: 1,
        alignItems: "center",
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        flexWrap: "wrap",
    },
    newsItem: {
        marginBottom: 5,
        paddingHorizontal: 3,
    },
    newsCard: {
        backgroundColor: "#fff",
        padding: 10,
        borderRadius: 4,
        elevation: 3,
        fontFamily: "OldStandard-Bold",
        alignItems: "center",
    },
    newsTitle: {
        fontWeight: "bold",
        fontSize: 18,
        marginBottom: 3,
        textAlign: "center",
        fontFamily: "OldStandard-Bold",
    },
    horizontalLine: {
        height: 0.5,
        backgroundColor: "#ccc",
        width: "100%",
        marginVertical: 8,
    },
    imagePlaceholder: {
        width: "100%",
        height: 100,
        backgroundColor: "#ddd",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 4,
        marginTop: 8,
    },
    summaryText: {
        color: "#555",
        lineHeight: 18,
        marginTop: 4,
    },
});

export default YasamTarziNewsScreen;
