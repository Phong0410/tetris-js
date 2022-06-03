/*** CONSTANTS ***/
const COLS = 10
const ROWS = 20
const BLOCK_SIZE = 30
const COLOR_MAPPING = [
	"red",
	"orange",
	"green",
	"purple",
	"blue",
	"cyan",
	"yellow",
	"white"
]
const BRICK_LAYOUT = [
	[
		[
			[7, 1, 7],
			[7, 1, 7],
			[1, 1, 7]
		],
		[
			[1, 7, 7],
			[1, 1, 1],
			[7, 7, 7]
		],
		[
			[7, 1, 1],
			[7, 1, 7],
			[7, 1, 7]
		],
		[
			[7, 7, 7],
			[1, 1, 1],
			[7, 7, 1]
		]
	],
	[
		[
			[7, 1, 7],
			[7, 1, 7],
			[7, 1, 1]
		],
		[
			[7, 7, 7],
			[1, 1, 1],
			[1, 7, 7]
		],
		[
			[1, 1, 7],
			[7, 1, 7],
			[7, 1, 7]
		],
		[
			[7, 7, 1],
			[1, 1, 1],
			[7, 7, 7]
		]
	],
	[
		[
			[1, 7, 7],
			[1, 1, 7],
			[7, 1, 7]
		],
		[
			[7, 1, 1],
			[1, 1, 7],
			[7, 7, 7]
		],
		[
			[7, 1, 7],
			[7, 1, 1],
			[7, 7, 1]
		],
		[
			[7, 7, 7],
			[7, 1, 1],
			[1, 1, 7]
		]
	],
	[
		[
			[7, 1, 7],
			[1, 1, 7],
			[1, 7, 7]
		],
		[
			[1, 1, 7],
			[7, 1, 1],
			[7, 7, 7]
		],
		[
			[7, 7, 1],
			[7, 1, 1],
			[7, 1, 7]
		],
		[
			[7, 7, 7],
			[1, 1, 7],
			[7, 1, 1]
		]
	],
	[
		[
			[7, 7, 7, 7],
			[1, 1, 1, 1],
			[7, 7, 7, 7],
			[7, 7, 7, 7]
		],
		[
			[7, 7, 1, 7],
			[7, 7, 1, 7],
			[7, 7, 1, 7],
			[7, 7, 1, 7]
		],
		[
			[7, 7, 7, 7],
			[7, 7, 7, 7],
			[1, 1, 1, 1],
			[7, 7, 7, 7]
		],
		[
			[7, 1, 7, 7],
			[7, 1, 7, 7],
			[7, 1, 7, 7],
			[7, 1, 7, 7]
		]
	],
	[
		[
			[1, 1],
			[1, 1]
		],
		[
			[1, 1],
			[1, 1]
		],
		[
			[1, 1],
			[1, 1]
		],
		[
			[1, 1],
			[1, 1]
		]
	],
	[
		[
			[7, 1, 7],
			[1, 1, 1],
			[7, 7, 7]
		],
		[
			[7, 1, 7],
			[7, 1, 1],
			[7, 1, 7]
		],
		[
			[7, 7, 7],
			[1, 1, 1],
			[7, 1, 7]
		],
		[
			[7, 1, 7],
			[1, 1, 7],
			[7, 1, 7]
		]
	]
]
const KEY_CODES = {
	LEFT: "ArrowLeft",
	RIGHT: "ArrowRight",
	UP: "ArrowUp",
	DOWN: "ArrowDown"
}
const WHITE_COLOR_ID = 7
const canvas = document.getElementById("board")
const canvasContext = canvas.getContext("2d")

canvasContext.canvas.width = COLS * BLOCK_SIZE
canvasContext.canvas.height = ROWS * BLOCK_SIZE

const SCORE = document.querySelector("#score")

class Board {
	constructor(context) {
		this.context = context
		this.grid = this.generateWhiteBoard()
		this.score = 0
		this.clearAudio = new Audio("../sounds_clear.wav")
	}

	generateWhiteBoard() {
		return Array.from({ length: ROWS }, () => Array(COLS).fill(WHITE_COLOR_ID))
	}

	drawCell(xAxis, yAxis, colorId) {
		this.context.fillStyle =
			COLOR_MAPPING[colorId] || COLOR_MAPPING[WHITE_COLOR_ID]
		this.context.fillRect(
			xAxis * BLOCK_SIZE,
			yAxis * BLOCK_SIZE,
			BLOCK_SIZE,
			BLOCK_SIZE
		)
		this.context.strokeRect(
			xAxis * BLOCK_SIZE,
			yAxis * BLOCK_SIZE,
			BLOCK_SIZE,
			BLOCK_SIZE
		)
	}

	drawBoard() {
		for (let row = 0; row < this.grid.length; row++) {
			for (let col = 0; col < this.grid[row].length; col++) {
				this.drawCell(col, row, this.grid[row][col])
			}
		}
	}

	handleCompleteRows() {
		const latestGrid = board.grid.filter((row) => {
			return row.some((col) => col === WHITE_COLOR_ID)
		})

		const newScore = ROWS - latestGrid.length
		const newRows = Array.from({ length: newScore }, () =>
			Array(COLS).fill(WHITE_COLOR_ID)
		)

		this.grid = [...newRows, ...latestGrid]
		this.handleScore(newScore)

		newScore && this.clearAudio.play()
	}

	handleScore(newScore) {
		this.score += newScore
		SCORE.textContent = this.score
	}
}

class Brick {
	constructor(id) {
		this.id = id
		this.layout = BRICK_LAYOUT[id]
		this.activeIndex = 0
		this.colPos = 3
		this.rowPos = -3
	}

	draw() {
		for (let row = 0; row < this.layout[this.activeIndex].length; row++) {
			for (let col = 0; col < this.layout[this.activeIndex][0].length; col++) {
				if (this.layout[this.activeIndex][row][col] !== WHITE_COLOR_ID) {
					board.drawCell(col + this.colPos, row + this.rowPos, this.id)
				}
			}
		}
	}

	clear() {
		for (let row = 0; row < this.layout[this.activeIndex].length; row++) {
			for (let col = 0; col < this.layout[this.activeIndex][0].length; col++) {
				if (this.layout[this.activeIndex][row][col] !== WHITE_COLOR_ID) {
					board.drawCell(col + this.colPos, row + this.rowPos, WHITE_COLOR_ID)
				}
			}
		}
	}

	moveLeft() {
		if (
			!this.checkCollision(
				this.rowPos,
				this.colPos - 1,
				this.layout[this.activeIndex]
			)
		) {
			this.clear()
			this.colPos--
			this.draw()

			return
		}
	}

	moveRight() {
		if (
			!this.checkCollision(
				this.rowPos,
				this.colPos + 1,
				this.layout[this.activeIndex]
			)
		) {
			this.clear()
			this.colPos++
			this.draw()

			return
		}
	}

	moveDown() {
		if (
			!this.checkCollision(
				this.rowPos + 1,
				this.colPos,
				this.layout[this.activeIndex]
			)
		) {
			this.clear()
			this.rowPos++
			this.draw()

			return
		}

		this.handleLand()
		generateNewBrick()
	}

	rotate() {
		if (
			!this.checkCollision(
				this.rowPos,
				this.colPos,
				this.layout[(this.activeIndex + 1) % 4]
			)
		) {
			this.clear()
			this.activeIndex = (this.activeIndex + 1) % 4
			this.draw()

			return
		}
	}

	checkCollision(nextRow, nextCol, nextLayout) {
		for (let row = 0; row < nextLayout.length; row++) {
			for (let col = 0; col < nextLayout[0].length; col++) {
				if (nextLayout[row][col] !== WHITE_COLOR_ID && nextRow >= 0) {
					if (
						nextCol + col < 0 ||
						nextCol + col >= COLS ||
						nextRow + row >= ROWS ||
						board.grid[nextRow + row][nextCol + col] !== WHITE_COLOR_ID
					) {
						return true
					}
				}
			}
		}
		return false
	}

	handleLand() {
		if (this.rowPos <= 0) {
			handleGameOver()
			return
		}

		for (let row = 0; row < this.layout[this.activeIndex].length; row++) {
			for (let col = 0; col < this.layout[this.activeIndex][0].length; col++) {
				if (this.layout[this.activeIndex][row][col] !== WHITE_COLOR_ID) {
					board.grid[this.rowPos + row][this.colPos + col] = this.id

					board.handleCompleteRows()
					board.drawBoard()
				}
			}
		}
	}
}

function generateNewBrick() {
	brick = new Brick(Math.floor((Math.random() * 10) % 7))
}

function handleGameOver() {
	clearInterval(timer)
	alert("Game over!")
}

board = new Board(canvasContext)
board.drawBoard()
// generateNewBrick()
// brick.draw()

let timer = undefined

document.querySelector("#play-btn").addEventListener("click", () => {
	clearInterval(timer)
	board.grid = board.generateWhiteBoard()
	board.drawBoard()
	board.score = 0
	board.handleScore(0)
	generateNewBrick()
	brick.draw()
	timer = setInterval(() => {
		brick.moveDown()
	}, 500)
})

document.addEventListener("keydown", (event) => {
	switch (event.code) {
		case KEY_CODES.LEFT:
			brick.moveLeft()
			break
		case KEY_CODES.RIGHT:
			brick.moveRight()
			break
		case KEY_CODES.UP:
			brick.rotate()
			break
		case KEY_CODES.DOWN:
			brick.moveDown()
			break
		default:
			break
	}
})
