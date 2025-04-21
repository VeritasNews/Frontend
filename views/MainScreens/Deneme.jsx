import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet, StatusBar } from 'react-native';

export default function Deneme() {
  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>BirGün</Text>
        <Text style={styles.date}>14 Nisan 2025 Pazartesi</Text>
      </View>

      {/* Main Headline */}
      <Text style={styles.mainHeadline}>İktidarın yeni hedefi gençler</Text>
      <Text style={styles.subHeadline}>
        "Kindar ve dindar" olmayı reddedip, özgür bir gelecek mücadelesinin parçası olan gençlere iktidar ve sürekası saldırıya geçti.
      </Text>

      {/* Image + Caption */}
      <Image
        source={require('../../assets/protest.jpg')} // Make sure this path is correct
        style={styles.image}
      />
      <Text style={styles.caption}>Üniversite öğrencilerinden protesto</Text>

      {/* Article Card 1 */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Ülke iflas etti, ağlayanı yok</Text>
        <Text style={styles.cardContent}>
          Türkiye’de rejim değişikliğinin yaşandığı 2018’de 29.7 milyon olan icra ve iflas dosyası sayısı, 2024 sonunda 32.7 milyona ulaştı.
        </Text>
      </View>

      {/* Article Card 2 */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Güçlü fikir 21 yaşında</Text>
        <Text style={styles.cardContent}>
          BirGün, zor yıllarda doğdu, baskılarla büyüdü. 21 yaşında da halkın gazetesi olmaya devam ediyor.
        </Text>
      </View>

      {/* Article Card 3 */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Durma şansı bile kalmadı</Text>
        <Text style={styles.cardContent}>
          Tek adam rejimi, baskılar ve krizle halkı kuşattı. Mücadele dışında bir seçenek kalmadı.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  logo: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#000',
  },
  date: {
    fontSize: 14,
    color: '#666',
  },
  mainHeadline: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#111',
  },
  subHeadline: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 6,
  },
  caption: {
    fontSize: 12,
    color: '#666',
    marginBottom: 14,
  },
  card: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
    elevation: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#111',
  },
  cardContent: {
    fontSize: 14,
    color: '#333',
  },
});
