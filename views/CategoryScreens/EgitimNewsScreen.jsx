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

const EgitimNewsScreen = ({ navigation }) => {
    const [newsData, setNewsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [portrait, setPortrait] = useState(isPortrait());

    useEffect(() => {
        fetchEgitimNews();
        const updateOrientation = () => setPortrait(isPortrait());
        const subscription = Dimensions.addEventListener("change", updateOrientation);
        return () => subscription?.remove();
    }, []);

    const fetchEgitimNews = async () => {
        setLoading(true);
        const egitimNews = await getArticlesByCategory("Egitim");
        setNewsData(egitimNews);
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

        return data.map((article, i) => {
            if (i < xl) return { ...article, size: "xl" };
            if (i < xl + lg) return { ...article, size: "large" };
            if (i < xl + lg + md) return { ...article, size: "medium" };
            if (i < xl + lg + md + sm) return { ...article, size: "small" };
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
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("NewsDetail", {
                articleId: item.id,
              })
            }
          >
            <View style={[styles.newsCard, styles[item.size]]}>
              <Text style={[styles.newsTitle, { fontSize: fontSize.title }]}>
                {item.title}
              </Text>
              <View style={styles.horizontalLine} />
              {item.summary && (
                <Text style={[styles.summaryText, { fontSize: fontSize.summary }]}>
                  {item.summary}
                </Text>
              )}
              {item.image && (
                <View style={styles.imagePlaceholder}>
                  <Text>Image</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        );
      };
      

    const createDynamicColumns = (data, count) => {
        const max = Math.min(count, 3);
        const columns = Array.from({ length: max }, () => []);
        data.forEach((item, i) => {
            const colIdx = i % max;
            if (columns[colIdx].length < 3) columns[colIdx].push(item);
            else columns[(colIdx + 1) % max].push(item);
        });
        return columns;
    };

    const createDynamicRows = (data, max = 3) => {
        const rows = [];
        let row = [];
        data.forEach((item) => {
            row.push(item);
            if (row.length === max) {
                rows.push(row);
                row = [];
            }
        });
        if (row.length > 0) rows.push(row);
        return rows;
    };

    const columnCount = portrait ? 2 : 3;
    const total = sortedNewsData.length;
    let s1 = Math.min(Math.ceil(total * 0.3), Math.floor(total / 3));
    let s3 = Math.min(Math.ceil(total * 0.3), Math.floor(total / 3));
    let s2 = total - (s1 + s3);

    if (total < 6) {
        const equal = Math.ceil(total / 3);
        s1 = s2 = equal;
        s3 = total - (s1 + s2);
    }

    const columnData1 = createDynamicColumns(sortedNewsData.slice(0, s1), columnCount);
    const columnData3 = createDynamicColumns(sortedNewsData.slice(s1 + s2), columnCount);
    const rowData = createDynamicRows(sortedNewsData.slice(s1, s1 + s2));

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
                <View style={styles.categoryContainer}><CategoryBar navigation={navigation} /></View>
                <View style={styles.section}>
                    <View style={styles.rowContainer}>
                        {columnData1.map((col, idx) => (
                            <View key={idx} style={styles.column}>
                                {col.map((item) => (
                                    <View key={item.id} style={styles.newsItem}>{renderNewsCard(item)}</View>
                                ))}
                            </View>
                        ))}
                    </View>
                </View>
                <View style={styles.section}>{rowData.map((r) => renderNewsRow(r))}</View>
                <View style={styles.section}>
                    <View style={styles.rowContainer}>
                        {columnData3.map((col, idx) => (
                            <View key={idx} style={styles.column}>
                                {col.map((item) => (
                                    <View key={item.id} style={styles.newsItem}>{renderNewsCard(item)}</View>
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

export default EgitimNewsScreen;