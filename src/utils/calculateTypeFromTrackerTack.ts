const CalculateTypeFromTrackerTack = (type: string) => {
    switch (type) {
        case "devTask":
            return 50;
        default:
            return 1;
    }
}

export default CalculateTypeFromTrackerTack;