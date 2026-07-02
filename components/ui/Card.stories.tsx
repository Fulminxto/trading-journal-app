import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Card from "./Card";

const meta = {
    title: "UI/Card",
    component: Card,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    args: {
        children: (
            <div className="w-72">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
                    Example Card
                </p>
                <h2 className="mt-4 text-2xl font-black tracking-tight text-white">
                    Premium Surface
                </h2>
                <p className="mt-3 text-sm text-gray-400">
                    Used to keep VOLTIS surfaces consistent.
                </p>
            </div>
        ),
    },
} satisfies Meta<typeof Card>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Base: Story = {
    args: {
        variant: "base",
    },
};

export const Hero: Story = {
    args: {
        variant: "hero",
    },
};

export const Inner: Story = {
    args: {
        variant: "inner",
    },
};

export const Interactive: Story = {
    args: {
        variant: "base",
        interactive: true,
    },
};