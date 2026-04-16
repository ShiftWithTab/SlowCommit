import React, { useRef, useState } from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    Alert
} from "react-native";
import ViewShot from "react-native-view-shot";
import * as Sharing from "expo-sharing";
import * as MediaLibrary from "expo-media-library";
import { Ionicons } from "@expo/vector-icons";
import { CONFIG } from "../constants/config";

const ResultCard = ({ type, message, level, character, goalTitle, onClose }: any) => {
    const ref = useRef<ViewShot | null>(null);

    const [loading, setLoading] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const [imgError, setImgError] = useState(false);
    const [bgLoaded, setBgLoaded] = useState(false);
    const [isCapturing, setIsCapturing] = useState(false);

    const backgroundMap: Record<string, string> = {
        FAILED: "FAILED.png",
        PARTIAL: "PARTIAL.png",
        SUCCESS: "SUCCESS.png"
    };

    const imageUrl = `${CONFIG.IMAGE_BASE_URL}/images/${backgroundMap[type]}`;

    // 📸 공통 캡처 함수
    const captureImage = async () => {
        await new Promise((r) => setTimeout(r, 150));
        return await ref.current?.capture();
    };

    // 📤 공유
    const captureAndShare = async () => {
        try {
            setLoading(true);
            setIsCapturing(true);

            const uri = await captureImage();
            if (!uri) return;

            await Sharing.shareAsync(uri);
        } catch (e) {
            console.log("공유 실패 ❌", e);
        } finally {
            setIsCapturing(false);
            setLoading(false);
        }
    };

    // 💾 다운로드 (갤러리 저장)
    const downloadImage = async () => {
        try {
            setDownloading(true);
            setIsCapturing(true);

            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status !== "granted") {
                Alert.alert("권한 필요", "사진 저장 권한이 필요합니다.");
                return;
            }

            const uri = await captureImage();
            if (!uri) return;

            const asset = await MediaLibrary.createAssetAsync(uri);
            await MediaLibrary.createAlbumAsync("ResultCards", asset, false);

            Alert.alert("저장 완료", "갤러리에 저장되었습니다 🎉");
        } catch (e) {
            console.log("다운로드 실패 ❌", e);
        } finally {
            setIsCapturing(false);
            setDownloading(false);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: "#000" }}>

            {/* preload */}
            {!bgLoaded && (
                <Image
                    source={{ uri: imageUrl }}
                    style={{ width: 1, height: 1 }}
                    onLoad={() => setBgLoaded(true)}
                    onError={() => {
                        setImgError(true);
                        setBgLoaded(true);
                    }}
                />
            )}

            {!bgLoaded ? (
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <ActivityIndicator size="large" color="#fff" />
                </View>
            ) : (
                <>
                    {/* 📸 캡처 영역 */}
                    <ViewShot ref={ref} style={{ flex: 1 }} options={{ format: "png", quality: 1 }}>

                        {/* background */}
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
                            <View style={{
                                position: "absolute",
                                width: "100%",
                                height: "100%",
                                backgroundColor: "#222"
                            }} />
                        )}

                        {/* overlay */}
                        <View style={{
                            position: "absolute",
                            width: "100%",
                            height: "100%",
                            backgroundColor: "rgba(0,0,0,0.4)"
                        }} />

                        {/* content */}
                        <View style={{
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "center",
                            padding: 24
                        }}>
                            <View style={{
                                width: "100%",
                                borderRadius: 32,
                                padding: 24,
                                backgroundColor: "rgba(255,255,255,0.15)",
                                alignItems: "center"
                            }}>
                                {goalTitle && (
                                    <View style={{
                                        marginBottom: 12,
                                        paddingHorizontal: 12,
                                        paddingVertical: 6,
                                        borderRadius: 12,
                                        backgroundColor: "rgba(255,255,255,0.1)"
                                    }}>
                                        <Text style={{
                                            color: "rgba(255,255,255,0.8)",
                                            fontSize: 14,
                                            textAlign: "center"
                                        }}>
                                            🎯 {goalTitle}
                                        </Text>
                                    </View>
                                )}

                                {/* LEVEL */}
                                <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, letterSpacing: 2 }} >
                                    LEVEL
                                </Text>

                                <Text style={{ color: "#fff", fontSize: 42 }}>
                                    {level}
                                </Text>

                                <Image
                                    source={{
                                        uri: character
                                            ? CONFIG.IMAGE_BASE_URL + character
                                            : undefined
                                    }}
                                    style={{ width: 160, height: 160 }}
                                    resizeMode="contain"
                                />

                                <Text style={{
                                    color: "#fff",
                                    fontSize: 20,
                                    textAlign: "center"
                                }}>
                                    {message}
                                </Text>
                            </View>
                        </View>
                    </ViewShot>

                    {/* 🔥 버튼 UI (캡처 제외) */}
                    {!isCapturing && (
                        <View style={{
                            position: "absolute",
                            top: 60,
                            right: 20,
                            flexDirection: "row",
                            gap: 12
                        }}>
                            {/* 공유 */}
                            <TouchableOpacity onPress={captureAndShare} style={iconButtonStyle}>
                                {loading ? (
                                    <ActivityIndicator size="small" color="#fff" />
                                ) : (
                                    <Ionicons name="share-social-outline" size={20} color="#fff" />
                                )}
                            </TouchableOpacity>

                            {/* 다운로드 */}
                            <TouchableOpacity onPress={downloadImage} style={iconButtonStyle}>
                                {downloading ? (
                                    <ActivityIndicator size="small" color="#fff" />
                                ) : (
                                    <Ionicons name="download-outline" size={20} color="#fff" />
                                )}
                            </TouchableOpacity>

                            {/* 닫기 */}
                            <TouchableOpacity onPress={onClose} style={iconButtonStyle}>
                                <Ionicons name="close" size={22} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    )}
                </>
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