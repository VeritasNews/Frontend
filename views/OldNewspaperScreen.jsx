import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useFonts } from "expo-font";
import { GLOBAL_STYLES, COLORS, FONTS } from "../theme/globalStyles";

const VeritasLogo = require("../assets/set2_no_bg.png");
const PaperTexture = require("../assets/paper_texture.png");

const OldNewspaperScreen = () => {
  const currentDate = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const [fontsLoaded] = useFonts({
    OldStandard: require("../assets/OldStandardTT-Regular.ttf"),
    "OldStandard-Bold": require("../assets/OldStandardTT-Bold.ttf"),
  });

  const articles = [
    {
      title:
        "Bahçeli, Öcalan'ı Meclis'te Konuşmaya Çağırıyor: Silah Bırakımını İlan Etsin",
      content:
        "MHP Genel Başkanı Devlet Bahçeli, PKK lideri Abdullah Öcalan'ın Türkiye Büyük Millet Meclisi'nde (TBMM) Halkların Eşitlik ve Demokrasi Partisi (DEM Parti) grup toplantısında konuşarak terörün bittiğini ve örgütün tasfiye edildiğini ilan etmesini istedi.  Bahçeli, Öcalan'ın tecridi kaldırılırsa bu konuşmayı yapması ve \"Umut Hakkı\"ndan yararlanmasının önünün açılacağını belirtti. Bu çağrının amacının terör sorununu TBMM çatısı altında çözmek ve \"milli birlik ve beraberliği çelikleştirmek\" olduğu vurgulandı.  Bahçeli, ayrıca Diyarbakır annelerinin evlatlarıyla buluşmasının sağlanması gerektiğini ve Türkiye'nin yeni bir çözüm sürecine değil, ortak akla ihtiyacı olduğunu dile getirdi.  Konuşmasında, Türkiye ekonomisinin güçlü performansına, \"yenidoğan çetesi\" olarak adlandırılan bebek ölümlerine ilişkin soruşturmaya, Fethullah Gülen'in ölümüne, İstanbul Baro Başkanlığı seçimlerine ve Türkiye'nin terörle mücadele deneyimine de değindi.  Bahçeli,  \"Kürt sorununun\" olmadığını, sorunun bölücü terör örgütü olduğunu,  Türkiye'nin asimilasyon politikası izlemediğini ve terörle mücadelede tek yolun teröristlerin adalete teslim olması olduğunu belirtti.  DEM Partisi'nden Bahçeli'nin çağrısına çeşitli tepkiler geldi; bazıları çağrıyı olumlu değerlendirirken, bazıları ise siyasi bir manevra olarak gördü.  Öcalan, 1999 yılından beri İmralı Cezaevi'nde bulunuyor ve PKK tarafından terör örgütü lideri olarak görülüyor.",
    },
    { title: "Trains Running", content: "Lorem ipsum dolor sit amet." },
    {
      title: "Foreign Views of the Strike",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    },
    {
      title: "Organized Menace",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    },
    { title: "Picketers and Food", content: "Lorem ipsum dolor sit amet." },
    { title: "To Car Owners", content: "Lorem ipsum dolor sit amet." },
    {
      title: "Why Walk to Work?",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam sed interdum tortor. Cras ac fringilla elit. Proin vel ligula id libero convallis posuere.",
    },
  ];

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image style={styles.logo} source={VeritasLogo} />
        <Text style={styles.title}>Veritas</Text>
        <Text style={styles.date}>{currentDate}</Text>
      </View>

      {/* Scrollable content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ImageBackground source={PaperTexture} style={styles.contentBackground}>
          {articles.map((article, index) => (
            <ExpandableArticle
              key={index}
              title={article.title}
              content={article.content}
              charLimit={150} // Limit of preview
            />
          ))}
        </ImageBackground>
      </ScrollView>
    </View>
  );
};

const ExpandableArticle = ({ title, content, charLimit }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <View style={styles.article}>
      <Text style={styles.articleTitle}>{title}</Text>
      <Text style={styles.articleText}>
        {expanded ? content : `${content.substring(0, charLimit)}...`}
      </Text>
      <TouchableOpacity onPress={toggleExpanded}>
        <Text style={styles.readMore}>
          {expanded ? "Read Less" : "Read More"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  logo: {
    width: 80,
    height: 80,
    resizeMode: "contain",
    marginBottom: 8,
  },
  title: {
    fontSize: FONTS.sizes.xLarge,
    fontFamily: "OldStandard-Bold",
    color: COLORS.textDefault,
  },
  date: {
    fontSize: FONTS.sizes.medium,
    fontFamily: "OldStandard",
    color: COLORS.textMuted,
  },
  scrollContent: {
    flexGrow: 1,
  },
  contentBackground: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    flexGrow: 1,
  },
  article: {
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: 16,
  },
  articleTitle: {
    fontSize: FONTS.sizes.large,
    fontFamily: "OldStandard-Bold",
    color: COLORS.textDefault,
    marginBottom: 8,
  },
  articleText: {
    fontSize: FONTS.sizes.regular,
    fontFamily: "OldStandard",
    color: COLORS.textMuted,
    lineHeight: 22,
    textAlign: "justify",
  },
  readMore: {
    fontSize: FONTS.sizes.medium,
    fontFamily: "OldStandard-Bold",
    color: COLORS.primary,
    marginTop: 8,
  },
});

export default OldNewspaperScreen;
