import { Button, StyleSheet, Text, View } from "react-native";
import BackgroundService from 'react-native-background-actions';
const myURL = 'https://3126109b333a.ngrok-free.app'

export default function Index() {
  return (
    <View style={styles.container}>
      <Text>Background Service Sample App</Text>
      <Button title="Start Task" onPress={handleStart} />
      <Button title="Stop Task" onPress={handleStop} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 20
  },
});

export async function ping(num: number) {
  await fetch(myURL + "/ping")
    .then(res => console.log("ping " + num, res.status))
    .catch(err => {
      console.log("Error", err.message)
    })
}

/* Below example is taken from https://github.com/Rapsssito/react-native-background-actions */
const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time));

// You can do anything in your task such as network requests, timers and so on,
// as long as it doesn't touch UI. Once your task completes (i.e. the promise is resolved),
// React Native will go into "paused" mode (unless there are other tasks running,
// or there is a foreground app).
const veryIntensiveTask = async (taskDataArguments: { delay: number } & any) => {
  // Example of an infinite loop task
  const { delay } = taskDataArguments;
  await new Promise(async () => {
    for (let i = 0; BackgroundService.isRunning(); i++) {
      ping(i);
      await sleep(delay);
    }
  });
};

const options = {
  taskName: 'Background Service Sample App',
  taskTitle: 'Background Service Sample App Task Title',
  taskDesc: 'Background Service Sample App Task Description',
  taskIcon: {
    name: 'ic_launcher',
    type: 'mipmap',
  },
  color: '#ff00ff',
  // linkingURI: 'yourSchemeHere://chat/jane', // See Deep Linking for more info
  parameters: {
    delay: 2000,
  },
};

function handleStart() {
  try {
    BackgroundService.start(veryIntensiveTask, options);
  } catch (error) {
    console.log('error starting task', error);
  }
}

function handleStop() {
  try {
    BackgroundService.stop();
  } catch (error) {
    console.log('error stopping task', error);
  }
}
