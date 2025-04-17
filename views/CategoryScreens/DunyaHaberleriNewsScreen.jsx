import React, { useState, useEffect } from "react";
import { View, ScrollView, Text, StyleSheet, Dimensions } from "react-native";
import { getArticlesByCategory } from "../../utils/api";
import Header from "../../components/Header";
import CategoryBar from "../../components/CategoryBar";
import BottomNav from "../../components/BottomNav";

const isPortrait = () => {
    const { width, height } = Dimensions.get("window");
    return height >= width;
};

const DunyaHaberleriNewsScreen = ({ navigation }) => {
    const [newsData, setNewsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [portrait, setPortrait] = useState(isPortrait());

    useEffect(() => {
        fetchNews();
        const updateOrientation = () => setPortrait(isPortrait());
        const subscription = Dimensions.addEventListener("change", updateOrientation);
        return () => subscription?.remove();
    }, []);

    const fetchNews = async () => {
        setLoading(true);
        const data = await getArticlesByCategory("Dünya Haberleri");
        setNewsData(data);
        setLoading(false);
    };

    const sortNewsByPriorityAndSize = (data) => {
        const priorityOrder = { high: 1, medium: 2, low: 3 };
        return [...data].sort((a, b) => {
            if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
                return priorityOrder[a.priority] - priorityOrder[b.priority];
            }
            const lenA = a.summary ? a.summary.length : 0;
            const lenB = b.summary ? b.summary.length : 0;
            return lenA - lenB;
        });
    };

    const assignNewsSizes = (data) => {
        const total = data.length;
        const xl = Math.ceil(total * 0.1);
        const large = Math.ceil(total * 0.15);
        const medium = Math.ceil(total * 0.25);
        const small = Math.ceil(total * 0.3);
        return data.map((article, i) => {
            if (i < xl) return { ...article, size: "xl" };
            else if (i < xl + large) return { ...article, size: "large" };
            else if (i < xl + large + medium) return { ...article, size: "medium" };
            else if (i < xl + large + medium + small) return { ...article, size: "small" };
            else return { ...article, size: "xs" };
        });
    };

    const sortedNewsData = assignNewsSizes(sortNewsByPriorityAndSize(newsData));

    const getFontSize = (size) => {
        switch (size) {
            case "xl": return { title: 20, summary: 13 };
            case "large": return { title: 19, summary: 12.7 };
            case "medium": return { title: 18, summary: 12.3 };
            case "small": return { title: 16, summary: 12 };
            case "xs":
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
        const cols = Array.from({ length: Math.min(count, 3) }, () => []);
        data.forEach((item, i) => {
            const index = i % cols.length;
            if (cols[index].length < 3) {
                cols[index].push(item);
            } else {
                cols[(index + 1) % cols.length].push(item);
            }
        });
        return cols;
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
    let sec1 = Math.min(Math.ceil(total * 0.3), Math.floor(total / 3));
    let sec3 = Math.min(Math.ceil(total * 0.3), Math.floor(total / 3));
    let sec2 = total - (sec1 + sec3);
    if (total < 6) {
        const equal = Math.ceil(total / 3);
        sec1 = sec2 = equal;
        sec3 = total - (sec1 + sec2);
    }

    const colData1 = createDynamicColumns(sortedNewsData.slice(0, sec1), columnCount);
    const colData3 = createDynamicColumns(sortedNewsData.slice(sec1 + sec2), columnCount);
    const rowData = createDynamicRows(sortedNewsData.slice(sec1, sec1 + sec2));

    const renderNewsRow = (row) => {
        const width = 100 / row.length;
        const last = 100 - (width * (row.length - 1));
        return (
            <View key={Math.random()} style={styles.row}>
                {row.map((item, i) => (
                    <View key={item.id} style={[styles.newsItem, { width: `${i === row.length - 1 ? last : width}%` }]}>
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
                        {colData1.map((column, i) => (
                            <View key={i} style={styles.column}>
                                {column.map((item) => (
                                    <View key={item.id} style={styles.newsItem}>
                                        {renderNewsCard(item)}
                                    </View>
                                ))}
                            </View>
                        ))}
                    </View>
                </View>
                <View style={styles.section}>
                    {rowData.map((row) => renderNewsRow(row))}
                </View>
                <View style={styles.section}>
                    <View style={styles.rowContainer}>
                        {colData3.map((column, i) => (
                            <View key={i} style={styles.column}>
                                {column.map((item) => (
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

export default DunyaHaberleriNewsScreen;
