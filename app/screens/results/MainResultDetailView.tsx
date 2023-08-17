import React, {PureComponent, Fragment, useCallback} from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import {getColor, Colors} from '../../styles/colors';
import {getSpace, Spaces} from '../../styles/spaces';
import {TextView} from '../../components/atoms/TextView';
import {FontStyles, getName} from '../../styles/fonts/names';
import {Sizes} from '../../styles/fonts/sizes';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import {getScoreFill} from './utils';
import {TextIconView} from '../../components/molecules/TextIcon';
import {IconSizes} from '../../styles/iconSizes';
import {VIEW_RESULT_HISTORY} from '../../assets/stringLiterals';
import EmailResultsView from '../../components/molecules/EmailResultsView';
import {HorizontalSeprator} from '../../components/atoms/HorizontalSeparator';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {StackNavigationProp} from '@react-navigation/stack';
import {PostEndpoints} from '../../networking/constants';
import ApiRequest from '../../networking/ApiRequest';
import Snackbar from 'react-native-snackbar';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: getColor({color: Colors.leftGradient, opacity: 100}),
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    padding: getSpace(Spaces.small),
  },
  titleStyle: {
    flex: 1,
    textAlign: 'center',
    marginVertical: getSpace(Spaces.medium),
    marginHorizontal: getSpace(Spaces.subMedium),
  },
  scoreViewTextStyle: {
    textAlign: 'center',
  },
  analysisTextStyle: {
    textAlign: 'center',
    marginVertical: getSpace(Spaces.subMedium),
    letterSpacing: 0.5,
  },
  iconTextContainer: {
    marginVertical: getSpace(Spaces.small),
    alignContent: 'space-between',
    marginHorizontal: getSpace(Spaces.medium),
  },
  resultIcon: {
    padding: getSpace(Spaces.xSmall),
  },
  separator: {
    marginVertical: getSpace(Spaces.xSmall),
    backgroundColor: getColor({color: Colors.secondaryColor, opacity: 20}),
  },
  progressBar: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const defaultStates = {
  isLoading: false,
};

type State = Partial<typeof defaultStates>;

export type MainResultDeatilViewProps = {
  navigation: StackNavigationProp<any, any>;
  title: string;
  score: number;
  analysis: string;
  scoreOutOf: number;
  onClickHistory?: {(): void};
  toggleProgressBar?: {(value: boolean): void};
};

const Title = ({title}: {title: string}) => {
  return title ? (
    <TextView
      style={styles.titleStyle}
      fontFamily={FontStyles.bold}
      fontSize={Sizes.xxLarge}
      textColor={{color: Colors.white}}>
      {title}
    </TextView>
  ) : null;
};

const ViewResultHistory = ({onClickHistory}: {onClickHistory: any}) => {
  const onClick = useCallback(() => {
    onClickHistory && onClickHistory();
  }, [onClickHistory]);
  const {width} = Dimensions.get('window');
  const separatorStyle = [
    styles.separator,
    {
      width: width - 2 * getSpace(Spaces.large),
      height: StyleSheet.hairlineWidth,
    },
  ];
  return (
    <Fragment>
      <HorizontalSeprator
        style={separatorStyle}
        height={StyleSheet.hairlineWidth}
        width={width - 2 * getSpace(Spaces.large)}
        color={{color: Colors.white}}
      />
      <TouchableOpacity onPress={onClick}>
        <TextIconView
          iconOnRight={false}
          iconProps={{
            style: styles.resultIcon,
            iconSize: IconSizes.medium,
            iconColor: {color: Colors.buttonFill},
            iconName: 'history',
          }}
          text={`${VIEW_RESULT_HISTORY}`}
          textProps={{
            fontFamily: FontStyles.bold,
            fontSize: Sizes.large,
            textColor: {color: Colors.buttonFill},
          }}
          styleTextIcon={styles.iconTextContainer}
        />
      </TouchableOpacity>

      <HorizontalSeprator
        style={separatorStyle}
        height={StyleSheet.hairlineWidth}
        width={width - 2 * getSpace(Spaces.large)}
        color={{color: Colors.white}}
      />
    </Fragment>
  );
};

const ScoreView = ({
  score,
  scoreOutOf,
}: {
  score: number;
  scoreOutOf: number;
}) => {
  return (
    <View>
      <TextView
        style={styles.scoreViewTextStyle}
        fontFamily={FontStyles.bold}
        textColor={{color: Colors.white}}
        fontSize={Sizes.xxxxLarge}>
        {score}
      </TextView>
      <TextView
        style={styles.scoreViewTextStyle}
        fontFamily={FontStyles.bold}
        textColor={{color: Colors.white}}
        fontSize={Sizes.xLarge}>{`out of ${scoreOutOf}`}</TextView>
    </View>
  );
};

export class MainResultDeatilView extends PureComponent<
  MainResultDeatilViewProps,
  State
> {
  constructor(props: MainResultDeatilViewProps) {
    super(props);
    this.state = defaultStates;
  }

  onClickHistory = () => {
    this.props.onClickHistory && this.props.onClickHistory();
  };

  onSendEmail = (email: string) => {
    this.props.toggleProgressBar && this.props.toggleProgressBar(true);
    const path = PostEndpoints.SEND_EMAIL;
    const requestBody = {
      to_email: email,
    };
    ApiRequest(path, 'POST', requestBody, undefined, undefined, false)
      .then(() => {
        this.props.toggleProgressBar && this.props.toggleProgressBar(false);
        Snackbar.show({
          text: 'Results sent successfully to provided email address',
          fontFamily: getName(FontStyles.medium),
          textColor: getColor({color: Colors.white}),
          backgroundColor: getColor({
            color: Colors.veryMild,
            opacity: 100,
          }),
          duration: Snackbar.LENGTH_LONG,
        });
      })
      .catch(() => {
        this.props.toggleProgressBar && this.props.toggleProgressBar(false);
        Snackbar.show({
          text: 'Sorry, email could not be sent, please try again.',
          fontFamily: getName(FontStyles.medium),
          textColor: getColor({color: Colors.white}),
          backgroundColor: getColor({
            color: Colors.error,
            opacity: 100,
          }),
          duration: Snackbar.LENGTH_LONG,
        });
      });
  };

  render() {
    return (
      <View style={styles.container}>
        <Title title={this.props.title} />
        <AnimatedCircularProgress
          size={Dimensions.get('window').width / 2}
          width={getSpace(Spaces.subMedium)}
          backgroundWidth={getSpace(Spaces.small)}
          fill={getScoreFill(this.props.scoreOutOf, this.props.score)}
          tintColor={getColor({color: Colors.veryMild})}
          // tintColorSecondary={getColor({
          //   color: Colors.graphFill,
          //   opacity: 100,
          // })}
          backgroundColor={getColor({
            color: Colors.secondaryColor,
            opacity: 80,
          })}
          arcSweepAngle={360}
          rotation={360}
          lineCap="round">
          {() => (
            <ScoreView
              score={this.props.score}
              scoreOutOf={this.props.scoreOutOf}
            />
          )}
        </AnimatedCircularProgress>
        <TextView
          style={styles.analysisTextStyle}
          fontFamily={FontStyles.regular}
          textColor={{color: Colors.white}}
          fontSize={Sizes.large}>
          {this.props.analysis}
        </TextView>
        <ViewResultHistory onClickHistory={this.onClickHistory} />
        <EmailResultsView onSendEmail={this.onSendEmail} />
      </View>
    );
  }
}
