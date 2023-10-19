import os
from os.path import exists

from rdkit.Chem.Draw import rdMolDraw2D
from io import BytesIO
from PIL import Image, ImageDraw, ImageFont
import math


def draw_legend(image, legend):
    """
    Draws the legend on the image of a molecule
    :param image:
    :param legend:
    :return:
    """

    # Splitting the lines on the '\n' character
    lines = legend.split('\n')

    # Creating the ImageDraw object
    d = ImageDraw.Draw(image)

    # Selecting the font with a size of 2.5% of the image height
    fnt = ImageFont.truetype(os.path.join("MixONat", 'arial.ttf'), math.floor(image.size[1] * 0.025))

    # Writing each line starting at 75% of the image height from the top
    y_offset = math.floor(image.size[1] * 0.75)
    for line in lines:
        # Next line will be written 3% of the image height below
        y_offset += math.floor(image.size[1] * 0.03)

        # Writing line
        d.text((0, y_offset), line, font=fnt, fill=(0, 0, 0))


def MolToImage(mol, size, highlighAtoms, legend, number_atoms=False):
    """
    Draws a molecule as a PIL image
    :param number_atoms:
    :param mol:
    :param size:
    :param highlighAtoms:
    :param legend:
    :return:
    """

    # Drawing the image
    mol = rdMolDraw2D.PrepareMolForDrawing(mol)

    drawer = rdMolDraw2D.MolDraw2DCairo(size[0], size[1], math.floor(size[0] * 0.75), math.floor(size[1] * 0.75))

    mol_atoms = [a.GetIdx() for a in mol.GetAtoms()]

    # If information is given, printing the number of the corresponding shift for each atom
    if number_atoms:
        op = drawer.drawOptions()
        for at in mol.GetAtoms():

            if at.GetSymbol() == "C":
                op.atomLabels[at.GetIdx()] = str(at.GetIdx() + 1)

    # Drawing the molecule with a smaller highlight radius than the default value
    drawer.DrawMolecule(mol, highlightAtoms=highlighAtoms, highlightAtomRadii={x: 0.2 for x in mol_atoms})
    drawer.FinishDrawing()

    # Converting to PIL image
    sio = BytesIO(drawer.GetDrawingText())
    img = Image.open(sio)

    # Drawing the legend
    draw_legend(img, legend)

    return img


def _compute_offset(sub_img_size, index, images_per_row):
    """
    Computes the offset of the current sub image according to its size, its index and the number of images per row.
    The offset is the x and y shift of the sub image relatively to the image origin (0, 0).
    :param sub_img_size:
    :param index:
    :param images_per_row:
    :return:
    """

    x_offset = (index % images_per_row) * sub_img_size[0]
    y_offset = (index // images_per_row) * sub_img_size[1]

    x_offset += math.floor(0.125 * sub_img_size[0])

    return x_offset, y_offset


def MolsToGridImage(mols, molsPerRow, subImgSize, highlightAtomLists, legends, results):
    # Computing canvas width and height
    canvas_w = molsPerRow * subImgSize[0]
    canvas_h = math.ceil(len(mols) / molsPerRow) * subImgSize[1]

    # Creating empty (white) image canvas
    canvas = Image.new('RGBA', (canvas_w, canvas_h), (255, 255, 255, 255))

    # Drawing all the molecules of the sheet
    for idx, mol in enumerate(mols):
        mols[idx] = rdMolDraw2D.PrepareMolForDrawing(mols[idx])

        # Computing the offset of the current molecule
        offset = _compute_offset(subImgSize, idx, molsPerRow)

        # Creating the current molecule image
        sub_img = MolToImage(mols[idx], subImgSize, highlightAtomLists[idx], legends[idx], True)

        # Inserting the molecule on the image at the correct position
        canvas.paste(sub_img, offset)

    return canvas
