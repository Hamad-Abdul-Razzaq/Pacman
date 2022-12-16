# Pacman - RenderJam CS 440
### Made by "The OC"
### (The Official, the original, the only Club that matters)
## About The Render
### Overview and Usage
This Render is a Mock of the Classic Arcade Game "Pacman". The render is an interactive render, in which we can move Pacman back-and-forth and make him walk any path. The colors fade and change continously which is done to make the render look horrific. Moreover, If we go from one of the openings in the middle, we end up getting on the other side of the opening
### How it was rendered
The Borders and the obstacles were rendered by rendering rectangles as a combination of two triangles. Calculations for the width, height , position, etc. of the borders and obstacles was done before hand and then the scene was hardcoded into the code. Next, Pacman was made by having the information of the center and the radius. Then using the equation of circle in the shader, it was rendered. The most challenging and joyful part was the continuous opening and closing of Pacman's Mouth. This was implemented by determining two equations of lines which represent the upper and the lower lip of the pacman. Then these equations were use to determine which points lie within them and they were colored black and the rest are colored yellow. There's a variable for theta (angle for opening of Pacman's lip) that will increase and decrease causing the pacman to open and close his mouth. For the intersection, The equations of triangle-triangle intersecion were used. Pacman's circle was approximated as a rectangle which is a combination of two triangles and hence these two trianlges were then checked whether they intersect with any other triangle in the scene or not. If they do, we donot move in that direction as we reach an obstacle. For the color, random numbers are being generated after evey 100 iterations which are responsible for changing the color. Similarly, there's a parameter that increase or decrease the visibility of the colors. All when combined together gives you this renowned version of the classic PacMan Game with limited interactive mode.

### References
1) For Triangle-Triangle Intersection: https://jsfiddle.net/eyal/gxw3632c/
