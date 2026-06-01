import type { ComponentType } from "react";
import type { FeatureDefinition } from "@/config/features.config";
import {
  AskFollowPhone,
  CollectDataPhone,
  CommentReplyPhone,
  DmReplyPhone,
  LiveReplyPhone,
  ReengagePhone,
  StoryReplyPhone,
  WelcomeFollowersPhone,
} from "@/components/FeaturesSection";

type PhoneProps = { animKey: number };

export const FEATURE_PHONE_MAP: Record<FeatureDefinition["id"], ComponentType<PhoneProps>> = {
  "auto-comment-reply": CommentReplyPhone,
  "story-auto-reply": StoryReplyPhone,
  "live-auto-reply": LiveReplyPhone,
  "dm-auto-reply": DmReplyPhone,
  "ask-for-follow": AskFollowPhone,
  "smart-reengage": ReengagePhone,
  "collect-user-data": CollectDataPhone,
  "welcome-new-followers": WelcomeFollowersPhone,
};
