import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { getArticles } from '../utils/api';

const ArticlesScreen = () => {
    const [articles, setArticles] = useState([]);

    useEffect(() => {
        fetchArticles();
    }, []);

    const fetchArticles = async () => {
        const data = await getArticles();
        setArticles(data);
    };

    return (
        <View>
            <FlatList
                data={articles}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View>
                        <Text>{item.title}</Text>
                        <Text>{item.date}</Text>  {/* Display article date */}
                    </View>
                )}
            />
        </View>
    );
};

export default ArticlesScreen;
