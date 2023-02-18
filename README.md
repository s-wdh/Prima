## PRIMA
Repository for the module "Prototyping interactive media-applications and games" in SoSe 22 and WiSe 22/23

## Final Project
- Title: PinguRun
- Author: Sarah Weidenhiller
- Year and season: Wintersemester 2022/2023
- Curriculum and semester: MKB 6
- Course: PRIMA
- Docent: Prof. Jirka Dell'Oro-Friedl
- Executable application: https://s-wdh.github.io/Prima/PinguRun/index.html
- Source code: https://github.com/s-wdh/Prima/tree/master/PinguRun
- Design document: https://s-wdh.github.io/Prima/PinguRun/Documents/PinguRun.pdf

### Description for the users on how to interact
Use A and D or left- and right-arrow keys to walk and the space key to jump, while moving the Character "Pingu" through the Track. <br> 
The Goal of the game is to bring Pingu back home safely before the time runs out.  <br> 
On the way you need to collect three stars, so Pingu is able to get home. After collecting a star it flies up to the night sky, where you always can check how many stars you’ve already collected. <br> 
Additionally, you can collect coins for Pingu. These don't give you any advantage, but Pingu is thankful about anything he can get.

## Checklist for the final assignment
The extended version of this list and explanations can be found in the Design document linked above.

| Nr | Criterion | Explanation | 
| :---: | :---: | --- | 
| 1 | Units and Positions | 0 = start of the track on top of the bottom track block. This makes it easy to check, if Pingu falls down of the blocks, as his position then has a negative y-value. The x-value is at the beginning of the track, as that is where the game starts and placing it in the middle of the track or somewhere else wouldn’t make sense. <br> 1 = measurement of one block in width and height, as well as the size of the Pingu-Character and the collectables. | 
| 2 | Hierarchy | The Track Elements are all collected together, so the Hierarchy in the editor isn’t overloaded by the three different kinds of Track Elements. The collectables all get the same parent Node, as they are all there to be collected. The Camera is connected to the Character node as it needs to be moved with the character together through the course. The different Sound nodes are all bundled under the Sound parent. <br> <ul> <li> Game </li> <ul> <li> Track </li> <ul> <li> Bottom Track </li> <li> Top Track </li> <li> Bridge </li> </ul> <li> Collectables </li> <ul> <li> Star </li> <li> Coin </li> <li> … </li> </ul> <li> Character </li> <ul> <li> Pingu (components via code) </li> <li> Camera </li> </ul> <li> Light </li> <li> Background </li> <li> Sound </li> <li> Igloo </li> </ul> </ul> |
| 3 | Editor | Visual Editor: <ul> <li> Hierarchy with all Parent Nodes for all needed elements </li> <li> Track Elements and their components, as they stay during the whole game and stay the same at any time </li> <li> Other elements that don’t need further adjustments like the background, the light and the sound nodes </li> </ul> Code: <ul> <li> Creation of the collectables that need to be deleted after collection and need different methods </li> <li> Character as there are many aspects that need to be adjusted </li> </ul> | 
| 4 | Scriptcomponents | Scriptcomponent to calculate and determine the positions of the obstacles based on how many collectables exist, so they get spread out evenly in the game. <br> It brought me the advantage of needing those code part only once in the scriptcomponent and not twice in each collectable class. | 
| 5 | Extend | I derived classes for the Pingu-Character, the Coins and the Stars as ƒ.Nodes from Fudge Core. <br> This was very useful for me as I could use the classes to set the methods which are needed in the game. | 
| 6 | Sound | I used sounds for the collection of stars, collection of coins, when Pingu is jumping as well as at the end of the game in case of loosing and winning. <br> I choose to not use a background music as it is unnecessary for a game like this in my opinion. | 
| 7 | VUI | The VUI shows the remaining time of the game, the amount of collected stars and coins. In front of every number is the description what exactly it is. | 
| 8 | Event-System | Custom event “checkGameEnd” that gets triggered in a case where the game ends. Those cases are: <ul> <li> timer has reached 0 </li> <li> Pingu falls down </li> <li> Pingu has reached the igloo after collecting three stars. </ul> The detail of the event contains the reasons why the game ended. <br> The use of the event system was useful, as it was an easy way to be used in all kinds of game end cases. | 
| 9 | External Data | External data to load the amount of stars, amount of coins and the game duration into the application. <br> This is useful as they can be easily adjusted this way to make the game harder or easier. | 
| A | Light | I choose an ambient light for Pingu Run, as there is no need for shadows in a 2D Game. | 
| B | Physics | <ul> <li> The Pingu character has a dynamic rigidbody. All track elements and the stars have static rigidbodies so they can create collisions with Pingu. The track elements block him from moving into that direction when he hits them. The stars send an event to their state machine when a collection is detected and thus transit into another job. </li> <li> For the jumping movement of Pingu I used the applyLinearImpulse method of its rigidbody. </li> <li> The bridge track element is a Joint Revolute which swings down when it is hit with enough force by the character. </li> </ul> | 
| ~C~ | ~Net~ | No network functionality is used in PinguRun. | 
| D | State Machines | Component State Machine for the stars as it was easy to distinguish their three stages of live: <ul> <li> Idle (being on the track, waiting to get collected) </li> <li> fly (flying up in the sky after getting collected) </li> <li> shine (being placed above of the track) </li> </ul> | 
| E | Animation | <ul> <li> Animation system to animate the rotation of the coins as well as to animate the flying up of the stars after their collection. </li> <li> Pingu has a Sprite Animation for his sprites so it looks like he is actually walking and not sliding along the track. </li> </ul> |
