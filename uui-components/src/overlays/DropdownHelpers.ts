import { closestTargetParentByCondition } from '@epam/uui-core';

export const isInteractedOutsideDropdown = (e: Event, stopNodes: HTMLElement[]) => {
    const [bodyNode] = stopNodes;

    if (stopNodes.some((node) => e.composedPath().includes(node))) {
        // Interacted inside any of the stop nodes
        return false;
    }

    // Interacted outside stop nodes, but on any "popper" with higher z-index - such interaction is considered as "inside"
    // (e.g. when child dropdown popover is clicked)
    const closestPopper = closestTargetParentByCondition(e, '.uui-popper');
    const closestPopperIndex = closestPopper ? +closestPopper.style.zIndex : 0;
    const bodyNodeIndex = bodyNode ? +bodyNode.style.zIndex : 0;
    return closestPopperIndex <= bodyNodeIndex;
};
