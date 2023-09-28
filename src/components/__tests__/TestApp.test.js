/**
 * @vitest-environment happy-dom
 */

import { mount } from "@vue/test-utils";
import App from "../../App.vue";
import { describe, expect, test } from "vitest";

describe("App", () => {
    test("renders correctly", () => {
        // check if the App component is rendered
        const wrapper = mount(App);
        expect(wrapper.exists()).toBe(true);

    });
}
);