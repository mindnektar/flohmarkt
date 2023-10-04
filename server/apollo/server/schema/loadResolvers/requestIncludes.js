const selectionIncludes = (selections, segments) => {
    if (!selections) {
        return false;
    }

    const segment = segments[0];
    const selection = selections.find((item) => item.name.value === segment);

    if (!selection) {
        return false;
    }

    return segments.length === 1 || selectionIncludes(selection.selectionSet?.selections, segments.slice(1));
};

export default (info, path) => {
    const segments = path.split('.');

    return selectionIncludes(info.fieldNodes[0].selectionSet.selections, segments);
};
