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

const SporNewsScreen = ({ navigation }) => {
    const [newsData, setNewsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [portrait, setPortrait] = useState(isPortrait());

    useEffect(() => {
        fetchSporNews();

        const updateOrientation = () => setPortrait(isPortrait());
        const subscription = Dimensions.addEventListener("change", updateOrientation);
        return () => subscription?.remove();
    }, []);

    const fetchSporNews = async () => {
        setLoading(true);
        const sporNews = await getArticlesByCategory("Spor");
        setNewsData(sporNews);
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
        const totalArticles = data.length;
        const xlCount = Math.ceil(totalArticles * 0.1);
        const largeCount = Math.ceil(totalArticles * 0.15);
        const mediumCount = Math.ceil(totalArticles * 0.25);
        const smallCount = Math.ceil(totalArticles * 0.30);

        return data.map((article, index) => {
            if (index < xlCount) return { ...article, size: "xl" };
            if (index < xlCount + largeCount) return { ...article, size: "large" };
            if (index < xlCount + largeCount + mediumCount) return { ...article, size: "medium" };
            if (index < xlCount + largeCount + mediumCount + smallCount) return { ...article, size: "small" };
            return { ...article, size: "xs" };
        });
    };

    const sortedNewsData = assignNewsSizes(sortNewsByPriorityAndSize(newsData));

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
                {item.summary && <Text style={[styles.summaryText, { fontSize: fontSize.summary }]}>{item.summary}</Text>}
                {item.image && <View style={styles.imagePlaceholder}><Text>Image</Text></View>}
            </View>
        );
    };

    const createDynamicColumns = (data, columnCount) => {
        const maxColumns = Math.min(columnCount, 3);
        const columns = Array.from({ length: maxColumns }, () => []);
        data.forEach((item, index) => {
            const columnIndex = index % maxColumns;
            if (columns[columnIndex].length < 3) {
                columns[columnIndex].push(item);
            } else {
                columns[(columnIndex + 1) % maxColumns].push(item);
            }
        });
        return columns;
    };

    const createDynamicRows = (data, maxItemsPerRow = 3) => {
        const rows = [];
        let currentRow = [];
        data.forEach((item) => {
            currentRow.push(item);
            if (currentRow.length === maxItemsPerRow) {
                rows.push(currentRow);
                currentRow = [];
            }
        });
        if (currentRow.length > 0) rows.push(currentRow);
        return rows;
    };

    const columnCount = portrait ? 2 : 3;
    const totalArticles = sortedNewsData.length;
    let section1Count = Math.min(Math.ceil(totalArticles * 0.3), Math.floor(totalArticles / 3));
    let section3Count = Math.min(Math.ceil(totalArticles * 0.3), Math.floor(totalArticles / 3));
    let section2Count = totalArticles - (section1Count + section3Count);

    if (totalArticles < 6) {
        const equalSize = Math.ceil(totalArticles / 3);
        section1Count = equalSize;
        section2Count = equalSize;
        section3Count = totalArticles - (section1Count + section2Count);
    }

    const columnData1 = createDynamicColumns(sortedNewsData.slice(0, section1Count), columnCount);
    const columnData3 = createDynamicColumns(sortedNewsData.slice(section1Count + section2Count), columnCount);
    const rowData = createDynamicRows(sortedNewsData.slice(section1Count, section1Count + section2Count));

    const renderNewsRow = (row) => {
        const numItems = row.length;
        const itemWidth = 100 / numItems;
        const lastItemWidth = 100 - (itemWidth * (numItems - 1));
        return (
            <View key={Math.random()} style={styles.row}>
                {row.map((newsItem, index) => (
                    <View
                        key={newsItem.id}
                        style={[styles.newsItem, { width: `${index === numItems - 1 ? lastItemWidth : itemWidth}%` }]}
                    >
                        {renderNewsCard(newsItem)}
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
                        {columnData1.map((column, columnIndex) => (
                            <View key={columnIndex} style={styles.column}>
                                {column.map((newsItem) => (
                                    <View key={newsItem.id} style={styles.newsItem}>
                                        {renderNewsCard(newsItem)}
                                    </View>
                                ))}
                            </View>
                        ))}
                    </View>
                </View>
                <View style={styles.section}>{rowData.map((row) => renderNewsRow(row))}</View>
                <View style={styles.section}>
                    <View style={styles.rowContainer}>
                        {columnData3.map((column, columnIndex) => (
                            <View key={columnIndex} style={styles.column}>
                                {column.map((newsItem) => (
                                    <View key={newsItem.id} style={styles.newsItem}>
                                        {renderNewsCard(newsItem)}
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

export default SporNewsScreen;