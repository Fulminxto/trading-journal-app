import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import VoltisLightningLoader from "./VoltisLightningLoader";

const meta = {
    title: "Brand/VoltisLightningLoader",
    component: VoltisLightningLoader,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
} satisfies Meta<typeof VoltisLightningLoader>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        size: 48,
        fullPage: false,
    },
};

export const Large: Story = {
    args: {
        size: 96,
        fullPage: false,
    },
};

export const FullPage: Story = {
    args: {
        size: 64,
        fullPage: true,
    },
};