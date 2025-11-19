import { Button, View } from 'react-native';
import styles from '../../resources/styles/styles.js';

const COMMANDS = {
    NEXT: 'next',
};

const NavigationButtons = (props) => {
    const { pageControl } = props;

    const handleNext = () => {
        pageControl(COMMANDS.NEXT);
    };

    return (
        <View
            key="navigationComponent"
            style={[
                styles.view,
                {
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    width: '100%',
                },
            ]}
        >
            <Button title="Next" onPress={handleNext} />
        </View>
    );
};

export default NavigationButtons;
