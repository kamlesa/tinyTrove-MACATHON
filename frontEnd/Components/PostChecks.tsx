import React, { useEffect, useState } from "react";
import { View, Pressable, Text, StyleSheet, Alert } from "react-native";
import { postApi } from "../lib/postApi";
import { timeAgo } from "../lib/timeAgo";

export type CheckSummary = {
  validation_count: number;
  sold_out_count: number;
  recent_sold_out_count: number; // sold-out reports in the last 7 days
  stock_status: "validated" | "sold_out" | null; // from the most recent check
  stock_updated_at: string | null;
  my_status: "validated" | "sold_out" | null;
};

type Props = {
  postId: string;
  summary: CheckSummary;
  isSignedIn: boolean;
  isMine: boolean; // authors can report sold out, but not validate
  onRequireSignIn?: () => void;
  onChange?: (summary: CheckSummary) => void;
  trailing?: React.ReactNode; // extra controls shown at the end of the button row
};

// Validated = "I saw it there too"; Sold out = "it was real, but it's gone now".
// Each user has one status per post; tapping your current status clears it.
export default function PostChecks({
  postId,
  summary: initialSummary,
  isSignedIn,
  isMine,
  onRequireSignIn,
  onChange,
  trailing,
}: Props) {
  const [summary, setSummary] = useState(initialSummary);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setSummary(initialSummary);
  }, [postId, initialSummary]);

  const handlePress = async (status: "validated" | "sold_out") => {
    if (!isSignedIn) return onRequireSignIn?.();
    if (busy) return;

    const next = summary.my_status === status ? null : status;
    const previous = summary;

    // Optimistic update of the counts; the server's answer replaces it
    const counts = { validated: summary.validation_count, sold_out: summary.sold_out_count };
    if (summary.my_status) counts[summary.my_status]--;
    if (next) counts[next]++;
    setSummary({
      ...summary,
      validation_count: counts.validated,
      sold_out_count: counts.sold_out,
      my_status: next,
      ...(next && { stock_status: next, stock_updated_at: new Date().toISOString() }),
    });
    setBusy(true);

    try {
      const result = await postApi.setCheck(postId, next);
      setSummary(result);
      onChange?.(result);
    } catch (error: any) {
      setSummary(previous);
      Alert.alert("Error", error.response?.data?.error || "Could not update this post");
    } finally {
      setBusy(false);
    }
  };

  const { stock_status, stock_updated_at, my_status } = summary;

  return (
    <View>
      {/* Sold out gets the prominent StockBanner above the post instead */}
      {stock_status === "validated" && stock_updated_at ? (
        <Text style={[styles.badge, styles.validatedBadge]}>
          ✓ Validated · {timeAgo(stock_updated_at)}
        </Text>
      ) : null}

      <View style={styles.row}>
        <Pressable
          onPress={() => handlePress("validated")}
          disabled={isMine}
          style={[styles.button, my_status === "validated" && styles.validatedActive, isMine && styles.disabled]}
          accessibilityRole="button"
          accessibilityLabel={`Validate, ${summary.validation_count} validations`}
        >
          <Text style={[styles.text, my_status === "validated" && styles.activeText]}>
            ✓ Validate · {summary.validation_count}
          </Text>
        </Pressable>

        <Pressable
          onPress={() => handlePress("sold_out")}
          style={[styles.button, styles.soldOutButton, my_status === "sold_out" && styles.soldOutActive]}
          accessibilityRole="button"
          accessibilityLabel={`Sold out, ${summary.sold_out_count} reports`}
        >
          <Text style={[styles.text, my_status === "sold_out" && styles.activeText]}>
            ✕ Sold out{summary.sold_out_count ? ` · ${summary.sold_out_count}` : ""}
          </Text>
        </Pressable>

        {trailing}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: "flex-start",
    fontSize: 13,
    fontWeight: "700",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
    overflow: "hidden",
    marginBottom: 8,
  },
  validatedBadge: { backgroundColor: "#DCEAF7", color: "#2F5F8A" },
  row: { flexDirection: "row", alignItems: "center", flexWrap: "wrap", gap: 8 },
  button: {
    borderWidth: 1.5,
    borderColor: "#71A5D3",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 5,
    backgroundColor: "#FFF8F0",
  },
  soldOutButton: { borderColor: "#C9784A" },
  validatedActive: { backgroundColor: "#71A5D3" },
  soldOutActive: { backgroundColor: "#C9784A" },
  disabled: { borderColor: "#C9B8A6" },
  text: { color: "#2A211D", fontSize: 14, fontWeight: "600" },
  activeText: { color: "#FFF8F0" },
});
