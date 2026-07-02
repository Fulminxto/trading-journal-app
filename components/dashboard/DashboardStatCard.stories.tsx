import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import DashboardStatCard from "./DashboardStatCard";

const meta = {
    title: "Dashboard/DashboardStatCard",
    component: DashboardStatCard,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
} satisfies Meta<typeof DashboardStatCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Profit: Story = {
    args: {
        label: "Total Profit",
        value: "+$1,248.50",
        tone: "text-emerald-400",
    },
};

export const Drawdown: Story = {
    args: {
        label: "Max Drawdown",
        value: "-3.2%",
        tone: "text-red-400",
    },
};

export const Neutral: Story = {
    args: {
        label: "Total Trades",
        value: 42,
    },
};