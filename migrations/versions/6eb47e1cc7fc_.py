"""empty message

Revision ID: 6eb47e1cc7fc
Revises: 802c1502f660
Create Date: 2024-03-28 12:46:42.358424

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '6eb47e1cc7fc'
down_revision = '802c1502f660'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('stocks', schema=None) as batch_op:
        batch_op.add_column(sa.Column('total_investment', sa.Float(), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('stocks', schema=None) as batch_op:
        batch_op.drop_column('total_investment')

    # ### end Alembic commands ###
