# Quark

Manage your state and gain profit.

## Example usage in react
```javascript
import { ReactGlobalStore } from '@mccue/quark'

// Can be any immutable data
const INITIAL_STATE = 0
// Creates a new global store object
const STORE = new ReactGlobalStore(0)

// For a more functional style, you can optionally
// bind the instance methods to global procedures
const subscribe = STORE.subscribe.bind(STORE)
const dispatch = STORE.dispatch.bind(STORE)
const reg_sub = STORE.reg_sub.bind(STORE)
const reg_event = STORE.reg_event.bind(STORE)


// to register a subscription
reg_sub('count', state => state)
reg_sub('squared' state => state * state)

// to register an event
reg_event('increment', state => state + 1)

// In your view

// All components using the global store must
// inherit from React.component. So pure functions
// will not work
class ExampleComponent extends Component {
  render() {
    return (
      <div>
        // Always Pass a reference to the subscribing component
        <p> Count: {subscribe(this, 'count')} </p>
        <p> Count squared: {subscribe(this, 'squared')} </p>
        <button onClick={() => dispatch('increment')}> increment </button>
      </div>
    )
  }
}
```
```
  ..                .';:cccc::;;;;,'..            . .;'..  ........
  ..              .,:cllllllcc::;;;,,'.........     .,.            
  ..             .,clcclllllccc:::;;;::::c:::;;,''...,'.            
  ..            .:lllclllllllccccccccllllllccc:::;;;;;,,'.          
  .            .:lllloollllcllccclllllllllcc:cc::::;;,,,,,'.       .
  ..           .,ccclddolllloooooooooooooolc::::::::::;,,,,,,..     .
  .     .      .;:cldddddddddddoooddooddddlcccc:;;;:::;;;,,,;;..    .
  ..  ..'..    .,;;:loooodddxddddddddoodddddlcccc:;;;::::;;,,;;;'.  .;
  .  .,:lol,. .';:;;clllllloooodddddooododddolcc::;;;::::;,,,,;;;.. .l
  .::'.,lo;.,::::;:::ccllllloooollloodoooollc::;;,,;::;;,'',,;;,..;o
  .;;..';:odlccc:cccccccclooddxxdolllllllllccc:;;;,,;;,,,'''',,,;.'ld
  .'...,,':oddlcccllooooooodxkkxdoooollcccc::::;,,,,,,,,,,'',,,,,':od
  .''.',,..':ldddolclodoollodxxxxddxxddollcc:::;,,,,,,,,,,,,,;;;,,;ldd
  .;;,,,''',;;;:codddoolllloddddddooooollllcc:::;;;;;;;;;::c:;;;:;:ooo
  .;:;,;::,..,,'.',:loddolooooooooollllllc::::::;:::::ccc:,.....';clll
  ..;c;;::,....;:;;'...;clodddoodooooooooollccllllccccc:,'....''''';:cc
  ..,::;;:;;:,,clc;'..,..',;::ccclllllcc:::;;;;;;;,'......''...','.',;:
  ....;:::cccccclol:,',c:,'..,cl:;,'..................',,'....  .,'.',;;
  'cc::lolcloool:;,,,;;;;colc:,.....':,....',,;,,,,'.. .....',,';:c;
  .;llc:clllddddooolcllloollc:;;;::;;c:,,'.';:ccc:;... ..',,';,,;cc;
  .;llc::;:cllodddoooooddol:;::cccc::;,,,;:clllc;,......';,;:;;cl:,
   .,cllc:;;;:codooooodxxdoc:::::cclolllllllllc:,....';:c:;::;:cc,,
  ......,:ll:;:cloocclllodoooc;:c:::clooooddolc::,....':lllc:;;:c:,,,
  ..',,,,,'.',;;;:cllc::;';:ccc:;,;:;,,;clllllcc:,,'....',:clc;,;clc,,,;
  :::cccc:;,''..;:cccccllc;''....',,',,;:ccccc::,''.....;;;;;,;cll:,,,,;
  :clc:;;;,'....,::ccc;;clllc::cloolcccc:::::::;'''.....','';odl:,,,;;,;
  lcc:,'...... ..;:ccc:lxdloddddlll:;;;;:::::;;'''....';:::cc:;...,,;;;,
  c:;;;,,,,'.....,;:clodddllolododoccc:;:::;;,,'''....''''........,;;;;,
  :ccc:,'.........,;:clllloooooollllcc::::,,,''''... ..........,,,;;;;,,
  ccccc;,''',''','.':clc::::cccc:;;;,,;::,.,,''........''.',,...';;;;;,;
  clccc::::::::;'...;coolllllcc:;;;;::::,.''.......','.....,;'...,;;:,,c
  ;::::::::::;'.  ';,;loooodddolcccccc:,''..........','.';,,;;'..';:;,cc
  '.,::c:::;..  .;l;,;;llcllooolccc:;,'''''',,,''...',,'....,;,'.';;,:o;
  ',:::c:,.. ..,lxc',:;'',,;;:::;;'.........',,'.....';,....',,'',,,,cc.
  ,::;cc,.  ..;;cc'.;c:'...........         .',,..'...','.....,,'''',c;.
```
