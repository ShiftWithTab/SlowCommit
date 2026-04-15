import React, { useRef, useState } from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    ActivityIndicator
} from "react-native";
import ViewShot from "react-native-view-shot";
import * as Sharing from "expo-sharing";
import { Ionicons } from "@expo/vector-icons";
import { CONFIG } from "../constants/config";

const ResultCard = ({ type, message, level, character, onClose }: any) => {
    const ref = useRef<ViewShot | null>(null);

    const [loading, setLoading] = useState(false);
    const [imgError, setImgError] = useState(false);
    const [bgLoaded, setBgLoaded] = useState(false); // 🔥 핵심

    const backgroundMap: Record<string, string> = {
        FAILED: "FAILED.png",
        PARTIAL: "PARTIAL.png",
        SUCCESS: "SUCCESS.png"
    };

    const imageUrl = `${CONFIG.IMAGE_BASE_URL}/images/${backgroundMap[type]}`;

    console.log("배경 URL 👉", imageUrl);
    console.log("캐릭터 URL 👉", CONFIG.IMAGE_BASE_URL + character);

    const captureAndShare = async () => {
        try {
            setLoading(true);

            if (!ref.current) return;

            // 🔥 이미지 렌더 안정화 (중요)
            await new Promise((r) => setTimeout(r, 100));

            const uri = await ref.current.capture();
            if (!uri) return;

            await Sharing.shareAsync(uri);
        } catch (e) {
            console.log("공유 실패 ❌", e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: "#000" }}>
            {/* 🔥 이미지 먼저 로딩 */}
            {!bgLoaded && (
                <Image
                    source={{ uri: imageUrl }}
                    style={{ width: 1, height: 1 }} // 화면에는 안 보이게
                    onLoad={() => {
                        console.log("배경 로딩 완료 ✅");
                        setBgLoaded(true);
                    }}
                    onError={(e) => {
                        console.log("배경 이미지 실패 ❌", e.nativeEvent);
                        setImgError(true);
                        setBgLoaded(true); // 실패해도 진행
                    }}
                />
            )}

            {/* 🔥 로딩 중 */}
            {!bgLoaded ? (
                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                >
                    <ActivityIndicator size="large" color="#fff" />
                </View>
            ) : (
                <ViewShot
                    ref={ref}
                    options={{ format: "png", quality: 1 }}
                    style={{ flex: 1 }}
                >
                    {/* 🔥 상단 버튼 */}
                    <View
                        style={{
                            position: "absolute",
                            top: 60,
                            right: 20,
                            flexDirection: "row",
                            gap: 16,
                            zIndex: 10
                        }}
                    >
                        <TouchableOpacity
                            onPress={captureAndShare}
                            style={iconButtonStyle}
                        >
                            {loading ? (
                                <ActivityIndicator size="small" color="#fff" />
                            ) : (
                                <Ionicons
                                    name="share-social-outline"
                                    size={20}
                                    color="#fff"
                                />
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={onClose}
                            style={iconButtonStyle}
                        >
                            <Ionicons name="close" size={22} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    {/* 🖼 배경 */}
                    {!imgError ? (
                        <Image
                            source={{ uri: imageUrl }}
                            style={{
                                position: "absolute",
                                width: "100%",
                                height: "100%"
                            }}
                            resizeMode="cover"
                        />
                    ) : (
                        <View
                            style={{
                                position: "absolute",
                                width: "100%",
                                height: "100%",
                                backgroundColor: "#222"
                            }}
                        />
                    )}

                    {/* 🌑 오버레이 */}
                    <View
                        style={{
                            position: "absolute",
                            width: "100%",
                            height: "100%",
                            backgroundColor: "rgba(0,0,0,0.4)"
                        }}
                    />

                    {/* 🎯 콘텐츠 */}
                    <View
                        style={{
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "center",
                            padding: 24
                        }}
                    >
                        <View
                            style={{
                                width: "100%",
                                borderRadius: 32,
                                padding: 24,
                                backgroundColor: "rgba(255,255,255,0.15)",
                                borderWidth: 1,
                                borderColor: "rgba(255,255,255,0.2)",
                                alignItems: "center"
                            }}
                        >
                            {/* LEVEL */}
                            <Text
                                style={{
                                    color: "rgba(255,255,255,0.7)",
                                    fontSize: 14,
                                    letterSpacing: 2
                                }}
                            >
                                LEVEL
                            </Text>

                            <Text
                                style={{
                                    color: "#fff",
                                    fontSize: 42,
                                    fontWeight: "800"
                                }}
                            >
                                {level}
                            </Text>

                            {/* 캐릭터 */}
                            <Image
                                source={{
                                    uri: CONFIG.IMAGE_BASE_URL + character
                                }}
                                style={{
                                    width: 160,
                                    height: 160,
                                    marginVertical: 12
                                }}
                                resizeMode="contain"
                                onError={() =>
                                    console.log("캐릭터 이미지 실패 ❌")
                                }
                            />

                            {/* 메시지 */}
                            <Text
                                style={{
                                    color: "#fff",
                                    fontSize: 20,
                                    textAlign: "center",
                                    lineHeight: 30,
                                    fontWeight: "600"
                                }}
                            >
                                {message}
                            </Text>
                        </View>
                    </View>
                </ViewShot>
            )}
        </View>
    );
};

const iconButtonStyle = {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center"
};

export default ResultCard;