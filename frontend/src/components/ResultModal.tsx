import React from "react";
import { Modal, View, StyleSheet } from "react-native";
import ResultCard from "./ResultCard";

const ResultModal = ({ visible, onClose, result }: any) => {
    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.overlay}>
                {result && (
                    <View style={styles.card}>
                        <ResultCard
                            type={result.resultType}
                            message={result.message}
                            level={result.level}
                            character={result.imageUrl}
                            onClose={onClose}
                            goalTitle={result.goalTitle}
                        />
                    </View>
                )}
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.7)",
        justifyContent: "center",
        alignItems: "center",
    },
    card: {
        width: "90%",
        height: "75%",      // ✅ 핵심: 명시적 높이 추가
        borderRadius: 20,
        overflow: "hidden",
    },
});

export default ResultModal;