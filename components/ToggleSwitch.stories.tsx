import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import ToggleSwitch from "./ToggleSwitch";

const meta = {
    title: "Components/ToggleSwitch",
    component: ToggleSwitch,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
} satisfies Meta<typeof ToggleSwitch>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Off: Story = {
    args: {
        name: "example-toggle",
        checked: false,
    },
};

export const On: Story = {
    args: {
        name: "example-toggle",
        checked: true,
    },
};

export const DisabledOff: Story = {
    args: {
        name: "disabled-toggle",
        checked: false,
        disabled: true,
    },
};

export const DisabledOn: Story = {
    args: {
        name: "disabled-toggle",
        checked: true,
        disabled: true,
    },
};